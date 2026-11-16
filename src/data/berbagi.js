// Data contoh untuk fitur Berbagi Data. Dipakai selama endpoint berbagi
// belum tersedia di server; bentuknya mengikuti snake_case kontrak data.

const JAM = 60 * 60 * 1000;
const lalu = (jam) => new Date(Date.now() - jam * JAM).toISOString();

export const KATEGORI_DATA = [
  { id: "biodata", label: "Biodata" },
  { id: "berkas_daftar_ulang", label: "Berkas daftar ulang" },
  { id: "dokumen", label: "Dokumen" },
  { id: "video", label: "Video perkenalan" },
];

export const pengguna = [
  { nama_pengguna: "anita.dummy", nama: "Anita Dummy", bergabung: "2026-10-03" },
  { nama_pengguna: "budi.dummy", nama: "Budi Dummy", bergabung: "2026-10-03" },
  { nama_pengguna: "citra.dummy", nama: "Citra Dummy", bergabung: "2026-10-03" },
  { nama_pengguna: "dewa.dummy", nama: "Dewa Dummy", bergabung: "2026-10-03" },
  { nama_pengguna: "eka.dummy", nama: "Eka Dummy", bergabung: "2026-10-03" },
  { nama_pengguna: "fajar.dummy", nama: "Fajar Dummy", bergabung: "2026-10-03" },
  { nama_pengguna: "gita.dummy", nama: "Gita Dummy", bergabung: "2026-10-05" },
  { nama_pengguna: "hana.dummy", nama: "Hana Dummy", bergabung: "2026-10-05" },
  { nama_pengguna: "indra.dummy", nama: "Indra Dummy", bergabung: "2026-10-05" },
];

// Permintaan yang diajukan pengguna ini kepada pemilik data lain.
// status: menunggu | disetujui (kunci belum dimasukkan) | aktif | ditolak | berakhir
export const permintaanKeluar = [
  {
    id: "k-1",
    pemilik: "anita.dummy",
    data: ["biodata", "berkas_daftar_ulang"],
    jumlah_berkas: 3,
    status: "menunggu",
    waktu_diajukan: "2026-11-16",
  },
  {
    id: "k-2",
    pemilik: "budi.dummy",
    data: ["biodata", "berkas_daftar_ulang"],
    jumlah_berkas: 2,
    status: "disetujui",
    waktu_diajukan: "2026-11-14",
    waktu_disetujui: "2026-11-15",
    berlaku_sampai: "2026-11-22",
  },
  {
    id: "k-3",
    pemilik: "citra.dummy",
    data: ["biodata", "berkas_daftar_ulang", "dokumen"],
    jumlah_berkas: 7,
    status: "aktif",
    waktu_diajukan: "2026-11-12",
    waktu_disetujui: "2026-11-13",
    berlaku_sampai: "2026-11-24",
  },
  {
    id: "k-4",
    pemilik: "dewa.dummy",
    data: ["biodata"],
    jumlah_berkas: 0,
    status: "ditolak",
    waktu_diajukan: "2026-11-13",
    waktu_ditolak: "2026-11-14",
  },
  {
    id: "k-5",
    pemilik: "eka.dummy",
    data: ["biodata", "berkas_daftar_ulang"],
    jumlah_berkas: 1,
    status: "berakhir",
    waktu_diajukan: "2026-11-01",
    waktu_disetujui: "2026-11-03",
    berlaku_sampai: "2026-11-10",
  },
];

// Permintaan dari pengguna lain atas data pengguna ini.
// status: menunggu | aktif | ditolak | dicabut
export const permintaanMasuk = [
  {
    id: "m-1",
    peminta: "fajar.dummy",
    data: ["biodata", "berkas_daftar_ulang"],
    pesan: "Untuk verifikasi berkas kelompok pendaftaran.",
    status: "menunggu",
    waktu_diajukan: lalu(2),
  },
  {
    id: "m-2",
    peminta: "gita.dummy",
    data: ["biodata"],
    pesan: "",
    status: "menunggu",
    waktu_diajukan: lalu(26),
  },
  {
    id: "m-3",
    peminta: "hana.dummy",
    data: ["biodata", "berkas_daftar_ulang"],
    jumlah_berkas: 3,
    status: "aktif",
    waktu_diajukan: "2026-11-09",
    waktu_disetujui: "2026-11-10",
    berlaku_sampai: "2026-11-24",
  },
  {
    id: "m-4",
    peminta: "indra.dummy",
    data: ["biodata"],
    jumlah_berkas: 0,
    status: "aktif",
    waktu_diajukan: "2026-11-12",
    waktu_disetujui: "2026-11-13",
    berlaku_sampai: "2026-11-20",
  },
];
