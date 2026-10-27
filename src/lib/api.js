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
const KUNCI_NAMA = "sipmaba_nama";

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
    this.status = status;
    this.rinci = rinci;
  }
}

// Semua permintaan dibungkus amplop terenkripsi (lihat transit.js).
// GET dikirim lewat header karena browser tidak mengizinkan body pada GET.
export async function panggil(jalur, opsi = {}, bolehUlang = true) {
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
  if (token) headers.Authorization = `Bearer ${token}`;
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
    // Sesi enkripsi habis (mis. server dimulai ulang): buat sesi baru
    // lalu ulangi sekali. Ini berbeda dari token login yang kedaluwarsa.
    lupakanSesi();
    return panggil(jalur, opsi, false);
  }

  if (!res.ok) {
    if (res.status === 401) {
      hapusToken();
      // Token kedaluwarsa saat memakai aplikasi: kembali ke halaman masuk.
      if (token && !jalur.startsWith("/auth/")) {
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
