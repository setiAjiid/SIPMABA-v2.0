const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
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

export async function panggil(jalur, { method = "GET", body } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = ambilToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${jalur}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new GalatApi(0, "Server tidak dapat dihubungi");
  }

  const data = await res.json().catch(() => null);

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
