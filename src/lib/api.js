import {
  adalahAmplop,
  ambilSesi,
  amplopKeHeader,
  buka,
  bungkus,
  lupakanSesi,
} from "./transit";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

const KUNCI_NAMA = "sipmaba_nama";

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
    sessionStorage.removeItem(KUNCI_NAMA);
  } catch (err) {
    console.error("Gagal menghapus sesi token:", err);
  }
};

export const cekSession = async () => {
  try {
    const data = await panggil("/beranda");
    return !!data;
  } catch (err) {
    return false;
  }
};

export class GalatApi extends Error {
  constructor(status, pesan, rinci) {
    super(pesan);
    this.status = status;
    this.rinci = rinci;
  }
}

export async function panggil(
  jalur,
  opsi = {},
  bolehUlang = true,
  sedangRefresh = false,
  isSilent = false,
) {
  const { method = "GET", body } = opsi;

  const init = {
    method,
    credentials: "include",
    headers: {},
  };

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

  if (method === "GET") {
    init.headers["X-Encrypted-Envelope"] = amplopKeHeader(amplop);
  } else {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(amplop);
  }

  let res;
  try {
    res = await fetch(`${BASE}${jalur}`, init);
  } catch (err) {
    throw new GalatApi(0, "Server tidak dapat dihubungi", err);
  }

  const mentahRes = await res.json().catch(() => null);
  let data = mentahRes;

  if (adalahAmplop(mentahRes)) {
    try {
      const isi = await buka(sesi, mentahRes, amplop.request_id);
      data = isi ? JSON.parse(isi) : null;
    } catch (err) {
      console.log(err);
      throw new GalatApi(
        res.status,
        "Respons server tidak dapat diverifikasi",
        err,
      );
    }
  } else if (
    res.status === 401 &&
    mentahRes?.error === "invalid or expired session" &&
    bolehUlang
  ) {
    lupakanSesi();
    return panggil(jalur, opsi, false, sedangRefresh, isSilent);
  }

  if (!res.ok) {
    const endpointAuth = jalur.startsWith("/auth/");

    if (res.status === 401 && !endpointAuth && !sedangRefresh) {
      try {
        await panggil("/auth/refresh", { method: "POST" }, false, true, true);
        return panggil(jalur, opsi, false, true, isSilent);
      } catch (err) {
        if (!isSilent) {
          hapusToken();
        }
        throw new GalatApi(
          401,
          "Sesi login berakhir, silakan masuk kembali",
          err,
        );
      }
    }

    const mentah = data?.message ?? data?.error ?? "Terjadi kesalahan";
    const pesan = mentah.charAt(0).toUpperCase() + mentah.slice(1);
    throw new GalatApi(res.status, pesan, data?.error);
  }

  return data;
}
