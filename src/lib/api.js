import {
  createEnvelope,
  isEncryptedEnvelope,
  openEnvelope,
} from "./crypto/encryption.js";
import { clearSession, getSession } from "./session.js";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const KUNCI = "sipmaba_token";
const KUNCI_NAMA = "sipmaba_nama";
const MAX_RETRIES = 1;

export const ambilToken = () => {
  try {
    return sessionStorage.getItem(KUNCI);
  } catch {
    return null;
  }
};

export const simpanToken = (token) => {
  try {
    sessionStorage.setItem(KUNCI, token);
  } catch {
    /* penyimpanan tidak tersedia */
  }
};

export const ambilNama = () => {
  try {
    return sessionStorage.getItem(KUNCI_NAMA);
  } catch {
    return null;
  }
};

export const simpanNama = (nama) => {
  try {
    sessionStorage.setItem(KUNCI_NAMA, nama);
  } catch {
    /* penyimpanan tidak tersedia */
  }
};

export const hapusToken = () => {
  try {
    sessionStorage.removeItem(KUNCI);
    sessionStorage.removeItem(KUNCI_NAMA);
  } catch {
    /* penyimpanan tidak tersedia */
  }
};

export class GalatApi extends Error {
  constructor(status, pesan, rinci) {
    super(pesan);
    this.name = "GalatApi";
    this.status = status;
    this.rinci = rinci;
  }
}

function tangani401(status, jalur, token) {
  if (status !== 401) {
    return;
  }

  hapusToken();

  // Token kedaluwarsa saat memakai aplikasi: kembali ke halaman masuk.
  if (token && !jalur.startsWith("/auth/")) {
    window.location.replace("/masuk");
  }
}

function throwApiError(status, data, token, jalur) {
  if (status === 401) {
    tangani401(status, jalur, token);
  }

  if (status === 429) {
    throw new GalatApi(429, "Terlalu banyak percobaan, coba lagi sebentar");
  }

  const mentah = data?.message ?? data?.error ?? "Terjadi kesalahan";
  const pesan =
    typeof mentah === "string" && mentah.length > 0
      ? mentah.charAt(0).toUpperCase() + mentah.slice(1)
      : "Terjadi kesalahan";

  throw new GalatApi(status, pesan, data?.error);
}

async function requestJSON(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new GalatApi(0, "Server tidak dapat dihubungi");
  }

  const data = await response.json().catch(() => null);

  return {
    response,
    data,
  };
}

async function sendHandshake(body) {
  const { response, data } = await requestJSON(`${BASE}/api/handshake`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throwApiError(response.status, data, null, "/api/handshake");
  }

  return data;
}

export async function panggil(jalur, { method = "GET", body, onDebug } = {}) {
  const token = ambilToken();
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (jalur === "/api/handshake") {
    const { response, data } = await requestJSON(`${BASE}${jalur}`, {
      method,
      headers: {
        ...headers,
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throwApiError(response.status, data, token, jalur);
    }

    return data;
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    let session;

    try {
      session = await getSession(sendHandshake);
    } catch (error) {
      if (error instanceof GalatApi) {
        throw error;
      }

      throw new GalatApi(
        0,
        error instanceof Error ? error.message : "Gagal membuat sesi enkripsi",
      );
    }

    let encrypted;

    try {
      encrypted = await createEnvelope(session, body, onDebug);
    } catch {
      throw new GalatApi(0, "Gagal mengenkripsi permintaan");
    }

    const { response, data } = await requestJSON(`${BASE}${jalur}`, {
      method,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(encrypted.envelope),
    });

    // Session-expiration errors from the middleware are plaintext.
    // Clear the encryption session and retry once with a new handshake.
    if (
      response.status === 401 &&
      data?.error === "invalid or expired session"
    ) {
      clearSession();

      if (attempt < MAX_RETRIES) {
        continue;
      }

      throw new GalatApi(401, "Sesi tidak valid atau kedaluwarsa", data.error);
    }

    let result = data;

    if (isEncryptedEnvelope(data)) {
      try {
        result = await openEnvelope(
          data,
          session,
          encrypted.requestID,
          onDebug,
        );
      } catch {
        throw new GalatApi(
          502,
          "Respons terenkripsi tidak valid atau gagal diverifikasi",
        );
      }
    } else if (response.ok) {
      throw new GalatApi(
        502,
        "Server mengembalikan respons yang tidak terenkripsi",
      );
    }

    if (!response.ok) {
      throwApiError(response.status, result, token, jalur);
    }

    onDebug?.({
      stage: "HTTP response received",
      status: response.status,
      body: data,
    });

    return result;
  }

  throw new GalatApi(401, "Sesi tidak valid atau kedaluwarsa");
}
