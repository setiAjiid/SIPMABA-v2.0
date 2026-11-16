import { useSyncExternalStore } from "react";
import { ambilNama } from "./api";
import { buatKunciBersama, buatPasanganKunci, bungkusKunci } from "./kunciBerbagi";
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
  kunci: null,
  kunciDimuat: false,
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
  return useSyncExternalStore(langganan, bacaKeadaan, bacaKeadaan);
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

export function setujuiPermintaan(id, { data, jumlah_berkas, hari, sidik_kunci }) {
  const sekarang = Date.now();
  ubahMasuk(id, {
    status: "aktif",
    data,
    jumlah_berkas,
    sidik_kunci,
    waktu_disetujui: new Date(sekarang).toISOString(),
    berlaku_sampai: new Date(sekarang + hari * 24 * 60 * 60 * 1000).toISOString(),
  });
}

const ubahKeluar = (id, perubahan) =>
  ubah((k) => ({
    keluar: k.keluar.map((p) => (p.id === id ? { ...p, ...perubahan } : p)),
  }));

export const pasangKunci = (id) =>
  ubahKeluar(id, {
    status: "aktif",
    waktu_kunci_dipasang: new Date().toISOString(),
    paket_contoh: undefined,
  });

// --- Pasangan kunci pengguna ini -------------------------------------------
// Disimpan di localStorage per akun. Kunci pribadi hanya tersimpan dalam
// bentuk terbungkus kata sandi (lihat kunciBerbagi.js).

const tempatKunci = () => `sipmaba_kunci_berbagi:${ambilNama() ?? "pengguna"}`;

export function muatKunci() {
  let kunci = null;
  try {
    kunci = JSON.parse(localStorage.getItem(tempatKunci()));
  } catch {
    /* penyimpanan tidak tersedia atau isinya rusak: anggap belum ada kunci */
  }
  if (!keadaan.kunciDimuat || kunci?.sidik !== keadaan.kunci?.sidik) {
    ubah(() => ({ kunci, kunciDimuat: true }));
  }
}

export function simpanKunci(kunci) {
  try {
    localStorage.setItem(tempatKunci(), JSON.stringify(kunci));
  } catch (err) {
    console.error("Gagal menyimpan pasangan kunci:", err);
  }
  ubah(() => ({ kunci, kunciDimuat: true }));
}

// --- Simulasi pihak lain ----------------------------------------------------
// Selama server berbagi belum ada, kunci publik pengguna lain dan paket yang
// "dikirim" pemilik data dibuat di peramban ini dengan kriptografi sungguhan.

const kunciContoh = new Map();

export function kunciPenggunaContoh(namaPengguna) {
  if (!kunciContoh.has(namaPengguna)) {
    kunciContoh.set(
      namaPengguna,
      buatPasanganKunci(crypto.randomUUID()).then(({ publik, sidik }) => ({
        publik,
        sidik,
      })),
    );
  }
  return kunciContoh.get(namaPengguna);
}

const paketDisiapkan = new Map();

// Membuat paket kunci dari pemilik untuk permintaan yang sudah disetujui,
// dibungkus dengan kunci publik pengguna ini yang sekarang.
export function siapkanPaketContoh(id) {
  const { keluar, kunci } = keadaan;
  const p = keluar.find((x) => x.id === id);
  if (!p || p.status !== "disetujui" || !kunci) return Promise.resolve();
  if (p.paket_contoh && p.sidik_penerima === kunci.sidik) return Promise.resolve();

  const tanda = `${id}:${kunci.sidik}`;
  if (!paketDisiapkan.has(tanda)) {
    paketDisiapkan.set(
      tanda,
      (async () => {
        const bersama = await buatKunciBersama();
        const paket = await bungkusKunci(bersama.mentah, kunci.publik);
        ubahKeluar(id, {
          sidik_kunci: bersama.sidik,
          paket_contoh: paket,
          sidik_penerima: kunci.sidik,
        });
      })().finally(() => paketDisiapkan.delete(tanda)),
    );
  }
  return paketDisiapkan.get(tanda);
}

export const jumlahMenunggu = (masuk) =>
  masuk.filter((p) => p.status === "menunggu").length;

// Isi berkas milik pengguna lain hanya bisa didekripsi server dengan kunci
// bersama, jadi belum tersedia selama endpoint berbagi belum ada.
export async function ambilBerkasDibagikan(permintaanId, namaBerkas) {
  throw new Error(
    `Isi ${namaBerkas} belum dapat dibuka karena server berbagi belum tersambung.`,
  );
}

export const aksesBerlaku = (permintaan) =>
  permintaan?.status === "aktif" &&
  new Date(permintaan.berlaku_sampai).getTime() > Date.now();

export function unduhTeks(namaBerkas, isi, tipe = "text/plain") {
  const url = URL.createObjectURL(new Blob([isi], { type: tipe }));
  const tautan = document.createElement("a");
  tautan.href = url;
  tautan.download = namaBerkas;
  tautan.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// false bila peramban menolak akses papan klip.
export async function salinTeks(teks) {
  try {
    await navigator.clipboard.writeText(teks);
    return true;
  } catch {
    return false;
  }
}

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
