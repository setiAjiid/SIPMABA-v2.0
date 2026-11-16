// Data contoh untuk fitur Berbagi Data. Dipakai selama endpoint berbagi
// belum tersedia di server; bentuknya mengikuti snake_case kontrak data.

const JAM = 60 * 60 * 1000;
const HARI = 24 * JAM;
const lalu = (jam) => new Date(Date.now() - jam * JAM).toISOString();
const hariLalu = (hari) => lalu(hari * 24);
const hariLagi = (hari) => new Date(Date.now() + hari * HARI).toISOString();

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

// Tanggal dihitung dari saat halaman dimuat supaya contoh akses aktif tidak
// kedaluwarsa dengan sendirinya.
//
// Permintaan yang diajukan pengguna ini kepada pemilik data lain.
// status: menunggu | disetujui (kunci belum dimasukkan) | aktif | ditolak | berakhir
export const permintaanKeluar = [
  {
    id: "k-1",
    pemilik: "anita.dummy",
    data: ["biodata", "berkas_daftar_ulang"],
    jumlah_berkas: 3,
    status: "menunggu",
    waktu_diajukan: hariLalu(1),
  },
  {
    id: "k-2",
    pemilik: "budi.dummy",
    data: ["biodata", "berkas_daftar_ulang"],
    jumlah_berkas: 2,
    status: "disetujui",
    waktu_diajukan: hariLalu(3),
    waktu_disetujui: hariLalu(2),
    berlaku_sampai: hariLagi(5),
  },
  {
    id: "k-3",
    pemilik: "citra.dummy",
    data: ["biodata", "berkas_daftar_ulang", "dokumen"],
    jumlah_berkas: 4,
    status: "aktif",
    waktu_diajukan: hariLalu(5),
    waktu_disetujui: hariLalu(4),
    berlaku_sampai: hariLagi(7),
  },
  {
    id: "k-4",
    pemilik: "dewa.dummy",
    data: ["biodata"],
    jumlah_berkas: 0,
    status: "ditolak",
    waktu_diajukan: hariLalu(4),
    waktu_ditolak: hariLalu(3),
  },
  {
    id: "k-5",
    pemilik: "eka.dummy",
    data: ["biodata", "berkas_daftar_ulang"],
    jumlah_berkas: 1,
    status: "berakhir",
    waktu_diajukan: hariLalu(16),
    waktu_disetujui: hariLalu(14),
    berlaku_sampai: hariLalu(7),
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
    waktu_diajukan: hariLalu(8),
    waktu_disetujui: hariLalu(7),
    berlaku_sampai: hariLagi(7),
  },
  {
    id: "m-4",
    peminta: "indra.dummy",
    data: ["biodata"],
    jumlah_berkas: 0,
    status: "aktif",
    waktu_diajukan: hariLalu(5),
    waktu_disetujui: hariLalu(4),
    berlaku_sampai: hariLagi(3),
  },
];

// Isi data pribadi yang dibagikan pemilik, dibuat dari urutan pengguna.
const TEMPAT_LAHIR = ["Malang", "Sidoarjo", "Surabaya", "Gresik", "Kediri", "Madiun"];
const PROGRAM_STUDI = [
  "Sistem Informasi",
  "Teknik Elektro",
  "Informatika",
  "Matematika",
  "Statistika",
  "Teknik Industri",
];

const BERKAS_CONTOH = {
  berkas_daftar_ulang: [
    { nama: "foto-profil-dummy.jpg", rincian: "JPG, 312 KB, 400 x 400" },
    { nama: "ijazah-dummy.jpg", rincian: "JPG, 458 KB" },
  ],
  dokumen: [
    { nama: "kartu-keluarga-dummy.pdf", rincian: "PDF, 1,2 MB" },
    { nama: "surat-keterangan-dummy.pdf", rincian: "PDF, 640 KB" },
  ],
  video: [{ nama: "video-perkenalan-dummy.mp4", rincian: "MP4, 18,4 MB" }],
};

export function dataContoh(pemilik, kategori) {
  const i = Math.max(
    0,
    pengguna.findIndex((p) => p.nama_pengguna === pemilik.nama_pengguna),
  );
  return {
    biodata: kategori.includes("biodata")
      ? [
          { label: "Nama lengkap", nilai: pemilik.nama },
          {
            label: "Tempat dan tanggal lahir",
            nilai: `${TEMPAT_LAHIR[i % TEMPAT_LAHIR.length]}, ${10 + i} Maret 2006`,
          },
          { label: "Alamat email", nilai: `${pemilik.nama_pengguna}@example.com` },
          { label: "Asal sekolah", nilai: `SMA Negeri Dummy ${((i + 1) % 3) + 1}` },
          { label: "Program studi", nilai: PROGRAM_STUDI[i % PROGRAM_STUDI.length] },
        ]
      : [],
    berkas: kategori.flatMap((k) => BERKAS_CONTOH[k] ?? []),
  };
}
