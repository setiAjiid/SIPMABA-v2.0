const gaya = "JPG/PNG, 200 sampai 500 KB";
const meterai = `${gaya}, bermeterai Rp10.000, setiap surat memakai meterai berbeda`;
const geotag = `${gaya}, wajib geotag`;

export const daftarUlang = [
  { id: "kipk", label: "Foto KIP-K / SKTM", hint: gaya, optional: true },
  { id: "rapor", label: "Rapor semester 1 sampai 7", hint: gaya },
  {
    id: "surat-biaya",
    label: "Surat Pernyataan Tidak Menarik Biaya Pendidikan",
    hint: meterai,
  },
  {
    id: "surat-palsu",
    label: "Surat Pernyataan Tidak Memalsukan Dokumen",
    hint: meterai,
  },
  {
    id: "surat-etik",
    label: "Surat Pernyataan Kode Etik Mahasiswa",
    hint: meterai,
  },
  { id: "tka", label: "Sertifikat dan nilai TKA", hint: gaya, optional: true },
];

export const unggahBerkas = [
  {
    judul: "Penghasilan",
    item: [
      {
        id: "bukti-penghasilan",
        label: "Bukti penghasilan orang tua (ayah dan ibu)",
        hint: gaya,
      },
      {
        id: "surat-pekerjaan",
        label: "Surat keterangan pekerjaan",
        hint: gaya,
      },
      {
        id: "foto-aktivitas",
        label: "Foto aktivitas orang tua saat bekerja",
        hint: gaya,
      },
    ],
  },
  {
    judul: "Listrik dan pajak",
    item: [
      { id: "tagihan-listrik", label: "Tagihan listrik", hint: gaya },
      { id: "pkb-roda-dua", label: "Bukti PKB roda dua", hint: gaya },
      { id: "pkb-roda-empat", label: "Bukti PKB roda empat", hint: gaya },
      { id: "pbb", label: "PBB", hint: gaya },
    ],
  },
  {
    judul: "Dokumen keluarga",
    item: [
      { id: "kartu-keluarga", label: "Kartu Keluarga", hint: gaya },
      { id: "akta-kelahiran", label: "Akta kelahiran", hint: gaya },
    ],
  },
  {
    judul: "Foto rumah",
    item: [
      { id: "rumah-depan", label: "Foto rumah tampak depan", hint: geotag },
      { id: "ruang-tamu", label: "Foto ruang tamu", hint: geotag },
      { id: "kamar-mandi", label: "Foto kamar mandi", hint: geotag },
      { id: "kamar-1", label: "Foto kamar 1", hint: geotag },
      { id: "kamar-2", label: "Foto kamar 2", hint: geotag },
    ],
  },
  {
    judul: "Lainnya",
    item: [
      {
        id: "dokumen-lain",
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
        label: "Video dokumentasi",
        hint: "MP4/WebM, maks 100 MB",
        accept: ["video/mp4", "video/webm"],
        minKB: 0,
        maxKB: 100 * 1024,
      },
    ],
  },
];
