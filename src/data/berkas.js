const gaya = "JPG/PNG, maks 500 KB";
const meterai = `${gaya}, bermeterai Rp10.000, setiap surat memakai meterai berbeda`;
const geotag = `${gaya}, wajib geotag`;

export const daftarUlang = [
  { id: "kipk", kode: "foto_kipk_sktm", label: "Foto KIP-K / SKTM", hint: gaya, optional: true },
  { id: "rapor", kode: "rapor_sem_", label: "Rapor semester 1 sampai 7", hint: gaya, jumlah: 7 },
  {
    id: "surat-biaya", kode: "surat_tidak_menarik_biaya",
    label: "Surat Pernyataan Tidak Menarik Biaya Pendidikan",
    hint: meterai,
  },
  {
    id: "surat-palsu", kode: "surat_tidak_memalsukan",
    label: "Surat Pernyataan Tidak Memalsukan Dokumen",
    hint: meterai,
  },
  {
    id: "surat-etik", kode: "surat_kode_etik",
    label: "Surat Pernyataan Kode Etik Mahasiswa",
    hint: meterai,
  },
  { id: "tka", kode: "sertifikat_nilai_tka", label: "Sertifikat dan nilai TKA", hint: gaya, optional: true },
];

export const unggahBerkas = [
  {
    judul: "Penghasilan",
    item: [
      {
        id: "bukti-penghasilan", kode: "bukti_penghasilan_ortu",
        label: "Bukti penghasilan orang tua (ayah dan ibu)",
        hint: gaya,
      },
      {
        id: "surat-pekerjaan", kode: "surat_keterangan_pekerjaan",
        label: "Surat keterangan pekerjaan",
        hint: gaya,
      },
      {
        id: "foto-aktivitas", kode: "foto_aktivitas_ortu",
        label: "Foto aktivitas orang tua saat bekerja",
        hint: gaya,
      },
    ],
  },
  {
    judul: "Listrik dan pajak",
    item: [
      { id: "tagihan-listrik", kode: "tagihan_listrik", label: "Tagihan listrik", hint: gaya },
      { id: "pkb-roda-dua", kode: "bukti_pkb_roda_dua", label: "Bukti PKB roda dua", hint: gaya },
      { id: "pkb-roda-empat", kode: "bukti_pkb_roda_empat", label: "Bukti PKB roda empat", hint: gaya },
      { id: "pbb", kode: "pbb", label: "PBB", hint: gaya },
    ],
  },
  {
    judul: "Dokumen keluarga",
    item: [
      { id: "kartu-keluarga", kode: "kartu_keluarga", label: "Kartu Keluarga", hint: gaya },
      { id: "akta-kelahiran", kode: "akta_kelahiran", label: "Akta kelahiran", hint: gaya },
    ],
  },
  {
    judul: "Foto rumah",
    item: [
      { id: "rumah-depan", kode: "foto_rumah_depan", label: "Foto rumah tampak depan", hint: geotag },
      { id: "ruang-tamu", kode: "foto_ruang_tamu", label: "Foto ruang tamu", hint: geotag },
      { id: "kamar-mandi", kode: "foto_kamar_mandi", label: "Foto kamar mandi", hint: geotag },
      { id: "kamar-1", kode: "foto_kamar_1", label: "Foto kamar 1", hint: geotag },
      { id: "kamar-2", kode: "foto_kamar_2", label: "Foto kamar 2", hint: geotag },
    ],
  },
  {
    judul: "Lainnya",
    item: [
      {
        id: "dokumen-lain",
        kode: "dokumen_lain",
        dokumen: true,
        label: "Dokumen",
        hint: "PDF/DOC/XLS, maks 10 MB",
        accept: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
        minKB: 0,
        maxKB: 10 * 1024,
      },
      {
        id: "video-dokumentasi",
        kode: "video_dokumentasi",
        video: true,
        label: "Video dokumentasi",
        hint: "MP4/WebM, maks 50 MB",
        accept: ["video/mp4", "video/webm"],
        minKB: 0,
        maxKB: 50 * 1024,
      },
    ],
  },
];
