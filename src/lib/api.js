import {
  adalahAmplop,
  ambilSesi,
  amplopKeHeader,
  buka,
  bungkus,
  lupakanSesi,
} from "./transit";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

const KUNCI = "sipmaba_token";
const KUNCI_REFRESH = "sipmaba_refresh_token";
const KUNCI_NAMA = "sipmaba_nama";

export const ambilToken = () => {
  try {
    return sessionStorage.getItem(KUNCI);
  } catch {
    return null;
  }
};

export const ambilRefreshToken = () => {
  try {
    return sessionStorage.getItem(KUNCI_REFRESH);
  } catch {
    return null;
  }
};

export const simpanToken = (token) => {
  try {
    sessionStorage.setItem(KUNCI, token);
  } catch (err) {
    console.error("Gagal menyimpan access token ke sessionStorage:", err);
  }
};

export const simpanRefreshToken = (token) => {
  try {
    sessionStorage.setItem(KUNCI_REFRESH, token);
  } catch (err) {
    console.error("Gagal menyimpan refresh token ke sessionStorage:", err);
  }
};

/**
 * Synchronized handler supporting both snake_case (refresh_token) 
 * and camelCase (refreshToken) returned by backend serializers.
 */
export const simpanTokenAuth = (data) => {
  const accessToken = data.access_token;
  const refreshToken = data.refresh_token;

  if (accessToken) {
    simpanToken(accessToken);
  }
  if (refreshToken) {
    simpanRefreshToken(refreshToken);
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
  } catch (err) {
    console.error("Gagal menyimpan nama pengguna:", err);
  }
};

export const hapusToken = () => {
  try {
    sessionStorage.removeItem(KUNCI);
    sessionStorage.removeItem(KUNCI_REFRESH);
    sessionStorage.removeItem(KUNCI_NAMA);
  } catch (err) {
    console.error("Gagal menghapus sesi token:", err);
  }
};

export class GalatApi extends Error {
  constructor(status, pesan, rinci) {
    super(pesan);
    this.status = status;
    this.rinci = rinci;
  }
}

// Hindari beberapa request refresh berjalan bersamaan.
let prosesRefresh = null;

// Refresh menggunakan mekanisme amplop terenkripsi yang sama.
async function segarkanToken() {
  if (prosesRefresh) {
    return prosesRefresh;
  }

  prosesRefresh = (async () => {
    const refreshToken = ambilRefreshToken();

    if (!refreshToken) {
      throw new GalatApi(401, "Sesi login berakhir, silakan masuk kembali");
    }

    const hasil = await panggil(
      "/auth/refresh",
      {
        method: "POST",
        body: { refresh_token: refreshToken },
      },
      false,
      true,
    );

    const data = hasil?.data ?? hasil;
    const newAccessToken = data?.access_token;
    const newRefreshToken = data?.refresh_token;

    if (!newAccessToken || !newRefreshToken) {
      throw new GalatApi(401, "Respons refresh token tidak valid");
    }

    simpanTokenAuth(data);
    return newAccessToken;
  })();

  try {
    return await prosesRefresh;
  } catch (err) {
    hapusToken();
    throw err;
  } finally {
    prosesRefresh = null;
  }
}

// Semua permintaan dibungkus amplop terenkripsi.
// GET dikirim lewat header karena browser tidak mengizinkan body pada GET.
export async function panggil(
  jalur,
  opsi = {},
  bolehUlang = true,
  sedangRefresh = false,
) {
  const { method = "GET", body } = opsi;
  const token = ambilToken();

  let sesi;

  try {
    sesi = await ambilSesi(BASE);
  } catch (err) {
    throw new GalatApi(
      err.status ?? 0,
      err.status ? err.message : "Server tidak dapat dihubungi",
    );
  }

  const amplop = await bungkus(sesi, body);
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init = { method, headers };

  if (method === "GET") {
    headers["X-Encrypted-Envelope"] = amplopKeHeader(amplop);
  } else {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(amplop);
  }

  let res;

  try {
    res = await fetch(`${BASE}${jalur}`, init);
  } catch {
    throw new GalatApi(0, "Server tidak dapat dihubungi");
  }

  const mentahRes = await res.json().catch(() => null);
  let data = mentahRes;

  if (adalahAmplop(mentahRes)) {
    try {
      const isi = await buka(sesi, mentahRes, amplop.request_id);
      data = isi ? JSON.parse(isi) : null;
    } catch {
      throw new GalatApi(res.status, "Respons server tidak dapat diverifikasi");
    }
  } else if (
    res.status === 401 &&
    mentahRes?.error === "invalid or expired session" &&
    bolehUlang
  ) {
    // Sesi enkripsi berbeda dari token autentikasi.
    lupakanSesi();
    return panggil(jalur, opsi, false, sedangRefresh);
  }

  if (!res.ok) {
    const endpointAuth = jalur.startsWith("/auth/");

    // Refresh hanya untuk access token yang kedaluwarsa.
    if (res.status === 401 && token && !endpointAuth && !sedangRefresh) {
      try {
        await segarkanToken();

        // Request asli dikirim ulang satu kali dengan access token baru.
        return panggil(jalur, opsi, false, true);
      } catch {
        hapusToken();
        window.location.replace("/masuk");
        throw new GalatApi(401, "Sesi login berakhir, silakan masuk kembali");
      }
    }

    if (res.status === 401 && !endpointAuth) {
      hapusToken();

      if (token) {
        window.location.replace("/masuk");
      }
    }

    if (res.status === 429) {
      throw new GalatApi(429, "Terlalu banyak percobaan, coba lagi sebentar");
    }

    const mentah = data?.message ?? data?.error ?? "Terjadi kesalahan";
    const pesan = mentah.charAt(0).toUpperCase() + mentah.slice(1);

    throw new GalatApi(res.status, pesan, data?.error);
  }

  return data;
}
