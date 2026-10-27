import FormKolom from "../../components/FormKolom";

const bagian = [
  {
    judul: "Identitas",
    kolom: [
      {
        nama: "noPendaftaran",
        label: "Nomor pendaftaran",
        bacaSaja: true,
        placeholder: "Dibuat otomatis oleh sistem",
      },
      { nama: "namaIjazah", label: "Nama sesuai ijazah" },
      { nama: "namaKtm", label: "Nama pada KTM", maks: 20 },
      {
        nama: "nik",
        label: "NIK",
        pola: /^\d{16}$/,
        galat: "NIK harus 16 digit",
        maks: 16,
        numerik: true,
      },
      { nama: "noPaspor", label: "Nomor paspor", opsional: true },
      {
        nama: "jenisKelamin",
        label: "Jenis kelamin",
        jenis: "select",
        pilihan: ["Laki-laki", "Perempuan"],
      },
      {
        nama: "agama",
        label: "Agama",
        jenis: "select",
        pilihan: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"],
      },
      {
        nama: "statusPernikahan",
        label: "Status pernikahan",
        jenis: "select",
        pilihan: ["Belum menikah", "Menikah", "Cerai"],
      },
      { nama: "tanggalLahir", label: "Tanggal lahir", tipe: "date" },
      { nama: "tempatLahir", label: "Tempat lahir (sesuai KTP)" },
    ],
  },
  {
    judul: "Kontak",
    kolom: [
      {
        nama: "email",
        label: "Email",
        tipe: "email",
        pola: /^\S+@\S+\.\S+$/,
        galat: "Format email tidak valid",
      },
      { nama: "noHp", label: "Nomor WhatsApp", tipe: "tel", numerik: true },
      {
        nama: "kodePos",
        label: "Kode pos",
        pola: /^\d{5}$/,
        galat: "Kode pos harus 5 digit",
        maks: 5,
        numerik: true,
      },
    ],
  },
  {
    judul: "Lainnya",
    kolom: [
      {
        nama: "ukuranAlmamater",
        label: "Ukuran almamater",
        jenis: "select",
        pilihan: ["S", "M", "L", "XL", "XXL"],
      },
      { nama: "noKipK", label: "Nomor KIP-K", opsional: true },
      { nama: "noBpjs", label: "Nomor BPJS", opsional: true },
      {
        nama: "sumberInformasi",
        label: "Sumber informasi",
        jenis: "select",
        pilihan: ["Website", "Media sosial", "Teman", "Keluarga", "Sekolah"],
      },
    ],
  },
];

export default function DataDiri() {
  return <FormKolom bagian={bagian} />;
}
