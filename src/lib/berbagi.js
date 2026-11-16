import { useSyncExternalStore } from "react";
import {
  pengguna as penggunaAwal,
  permintaanKeluar,
  permintaanMasuk,
} from "../data/berbagi";

// Penyimpanan sementara fitur Berbagi Data. Endpoint berbagi belum ada di
// server, jadi keadaan disimpan di memori dan kembali ke data contoh saat
// halaman dimuat ulang. Halaman hanya memakai fungsi di modul ini, sehingga
// nanti cukup modul ini yang diganti dengan pemanggilan `panggil(...)`.
let keadaan = {
  pengguna: penggunaAwal,
  keluar: permintaanKeluar,
  masuk: permintaanMasuk,
};

const pendengar = new Set();

function langganan(fungsi) {
  pendengar.add(fungsi);
  return () => pendengar.delete(fungsi);
}

export function ubah(pembaru) {
  keadaan = { ...keadaan, ...pembaru(keadaan) };
  pendengar.forEach((fungsi) => fungsi());
}

export const bacaKeadaan = () => keadaan;

export function useBerbagi() {
  return useSyncExternalStore(langganan, bacaKeadaan);
}

export const cariPengguna = (daftar, namaPengguna) =>
  daftar.find((p) => p.nama_pengguna === namaPengguna);

// Permintaan terbaru pengguna ini kepada seorang pemilik data.
export const permintaanUntuk = (keluar, namaPengguna) =>
  keluar.find((p) => p.pemilik === namaPengguna);

// Permintaan baru menggantikan permintaan lama kepada pemilik yang sama
// (ditolak atau berakhir), sehingga satu pemilik hanya punya satu baris.
export function ajukanPermintaan(pemilik, data, pesan = "") {
  const baru = {
    id: `k-${Date.now()}`,
    pemilik,
    data,
    pesan,
    status: "menunggu",
    waktu_diajukan: new Date().toISOString(),
  };
  ubah((k) => ({
    keluar: [baru, ...k.keluar.filter((p) => p.pemilik !== pemilik)],
  }));
  return baru;
}

export function batalkanPermintaan(id) {
  ubah((k) => ({ keluar: k.keluar.filter((p) => p.id !== id) }));
}

const ubahMasuk = (id, perubahan) =>
  ubah((k) => ({
    masuk: k.masuk.map((p) => (p.id === id ? { ...p, ...perubahan } : p)),
  }));

export const tolakPermintaan = (id) =>
  ubahMasuk(id, { status: "ditolak", waktu_ditolak: new Date().toISOString() });

// Mencabut akses juga menghapus kunci bersama yang disimpan untuk peminta.
export const cabutAkses = (id) =>
  ubahMasuk(id, {
    status: "dicabut",
    waktu_dicabut: new Date().toISOString(),
    paket_kunci: undefined,
  });

export const jumlahMenunggu = (masuk) =>
  masuk.filter((p) => p.status === "menunggu").length;

export function inisial(nama) {
  return nama
    .split(/\s+/)
    .slice(0, 2)
    .map((kata) => kata[0]?.toUpperCase() ?? "")
    .join("");
}

const formatTanggalId = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const formatTanggal = (waktu) => formatTanggalId.format(new Date(waktu));

export function waktuRelatif(waktu) {
  const selisih = Date.now() - new Date(waktu).getTime();
  const menit = Math.floor(selisih / 60000);
  if (menit < 1) return "Baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hari = Math.floor(jam / 24);
  if (hari === 1) return "Kemarin";
  if (hari < 7) return `${hari} hari lalu`;
  return formatTanggal(waktu);
}

// "Biodata dan 3 berkas", "Biodata", atau "Berkas" bila jumlahnya belum
// diketahui (pemilik belum memilih berkas yang dibagikan).
export function ringkasData(permintaan) {
  const bagian = [];
  if (permintaan.data.includes("biodata")) bagian.push("biodata");
  const mintaBerkas = permintaan.data.some((d) => d !== "biodata");
  if (permintaan.jumlah_berkas > 0) {
    bagian.push(`${permintaan.jumlah_berkas} berkas`);
  } else if (mintaBerkas && permintaan.jumlah_berkas === undefined) {
    bagian.push("berkas");
  }
  const teks = bagian.join(" dan ");
  return teks.charAt(0).toUpperCase() + teks.slice(1);
}
