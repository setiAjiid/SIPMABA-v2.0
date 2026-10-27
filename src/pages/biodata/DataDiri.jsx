import FormKolom from "../../components/FormKolom";
import FotoProfil from "../../components/FotoProfil";
import { berkasBelumAda } from "../../lib/berkas";
import { wilayah } from "../../data/wilayah";
import { yaTidak } from "../../lib/biodata";

const negara = ["Indonesia"];
const provinsi = Object.keys(wilayah);
const kotaDari = (nama) => (f) => wilayah[f[nama]] ?? [];

const bagian = [
  { judul: "Foto", kustom: <FotoProfil /> },
  {
    judul: "Identitas",
    kolom: [
      {
        nama: "noPendaftaran",
        label: "No. pendaftaran",
        bacaSaja: true,
        placeholder: "Dibuat otomatis oleh sistem",
      },
      { nama: "namaIjazah", label: "Nama (sesuai ijazah)" },
      { nama: "namaKtm", label: "Nama untuk KTM", maks: 20 },
      {
        nama: "ukuranAlmamater",
        label: "Ukuran almamater",
        jenis: "select",
        pilihan: ["S", "M", "L", "XL", "XXL"],
      },
      {
        nama: "programStudi",
        label: "Program studi",
        jenis: "select",
        pilihan: ["Informatika", "Sistem Informasi", "Teknik Komputer"],
      },
      {
        nama: "jalurMasuk",
        label: "Jalur masuk",
        jenis: "select",
        pilihan: ["Seleksi Mandiri"],
      },
      { nama: "periodeMasuk", label: "Periode masuk" },
      {
        nama: "kewarganegaraan",
        label: "Kewarganegaraan",
        jenis: "select",
        pilihan: ["Indonesia", "Warga negara asing"],
      },
      {
        nama: "nik",
        label: "No. KTP/NIK",
        pola: /^\d{16}$/,
        galat: "NIK harus 16 digit",
        maks: 16,
        numerik: true,
        petunjuk: "16 digit",
      },
      {
        nama: "noPaspor",
        label: "No. paspor",
        opsional: true,
        placeholder: "Masukkan nomor paspor",
      },
      {
        nama: "statusPernikahan",
        label: "Status pernikahan",
        jenis: "select",
        pilihan: ["Belum menikah", "Menikah", "Cerai"],
      },
      {
        nama: "jenisKelamin",
        label: "Jenis kelamin",
        jenis: "radio",
        pilihan: [
          { nilai: "laki_laki", label: "Laki-laki" },
          { nilai: "perempuan", label: "Perempuan" },
        ],
      },
      {
        nama: "agama",
        label: "Agama",
        jenis: "select",
        pilihan: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"],
      },
    ],
  },
  {
    judul: "Kelahiran",
    kolom: [
      { nama: "tanggalLahir", label: "Tanggal lahir", tipe: "date" },
      {
        nama: "tempatLahir",
        label: "Tempat lahir",
        anak: [
          {
            nama: "negaraLahir",
            label: "Negara lahir",
            placeholder: "Negara",
            jenis: "select",
            pilihan: negara,
          },
          {
            nama: "provinsiLahir",
            label: "Provinsi lahir",
            placeholder: "Provinsi",
            jenis: "select",
            pilihan: provinsi,
          },
          {
            nama: "kotaLahir",
            label: "Kota lahir",
            placeholder: "Kota",
            jenis: "select",
            bergantung: "provinsiLahir",
            pilihan: kotaDari("provinsiLahir"),
          },
        ],
      },
      { nama: "tempatLahirKtp", label: "Tempat lahir sesuai KTP" },
    ],
  },
  {
    judul: "Alamat",
    kolom: [
      { nama: "alamatKtp", label: "Alamat sesuai KTP", jenis: "area" },
      {
        nama: "negaraAsal",
        label: "Negara asal",
        jenis: "select",
        pilihan: negara,
      },
      {
        nama: "wilayahAsal",
        label: "Kota asal",
        anak: [
          {
            nama: "provinsiAsal",
            label: "Provinsi asal",
            placeholder: "Provinsi",
            jenis: "select",
            pilihan: provinsi,
          },
          {
            nama: "kotaAsal",
            label: "Kota asal",
            placeholder: "Kota",
            jenis: "select",
            bergantung: "provinsiAsal",
            pilihan: kotaDari("provinsiAsal"),
          },
        ],
      },
      {
        nama: "kodePos",
        label: "Kode pos",
        pola: /^\d{5}$/,
        galat: "Kode pos harus 5 digit",
        maks: 5,
        numerik: true,
      },
      { nama: "alamatDomisili", label: "Alamat domisili", jenis: "area" },
      {
        nama: "negaraDomisili",
        label: "Negara domisili",
        jenis: "select",
        pilihan: negara,
      },
      {
        nama: "wilayahDomisili",
        label: "Kota domisili",
        anak: [
          {
            nama: "provinsiDomisili",
            label: "Provinsi domisili",
            placeholder: "Provinsi",
            jenis: "select",
            pilihan: provinsi,
          },
          {
            nama: "kotaDomisili",
            label: "Kota domisili",
            placeholder: "Kota",
            jenis: "select",
            bergantung: "provinsiDomisili",
            pilihan: kotaDari("provinsiDomisili"),
          },
        ],
      },
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
      {
        nama: "noHp",
        label: "No. HP",
        tipe: "tel",
        numerik: true,
        petunjuk: "Wajib WhatsApp",
      },
    ],
  },
  {
    judul: "Lainnya",
    kolom: [
      { nama: "noKipK", label: "KIP-K", opsional: true },
      {
        nama: "noBpjs",
        label: "No. BPJS/asuransi kesehatan",
        opsional: true,
      },
      {
        nama: "sumberInformasi",
        label: "Sumber informasi",
        jenis: "radio",
        pilihan: [
          { nilai: "website", label: "Website" },
          { nilai: "media_sosial", label: "Media Sosial" },
          { nilai: "teman", label: "Teman" },
          { nilai: "keluarga", label: "Keluarga" },
          { nilai: "sekolah", label: "Sekolah" },
        ],
      },
      {
        nama: "daftarAsrama",
        label: "Daftar asrama",
        jenis: "radio",
        pilihan: yaTidak,
        boolean: true,
      },
    ],
  },
];

const kunci = {
  noPendaftaran: "no_pendaftaran",
  namaIjazah: "nama_ijazah",
  namaKtm: "nama_ktm",
  ukuranAlmamater: "ukuran_almamater",
  programStudi: "program_studi",
  jalurMasuk: "jalur_masuk",
  periodeMasuk: "periode_masuk",
  kewarganegaraan: "kewarganegaraan",
  nik: "nik",
  noPaspor: "no_paspor",
  statusPernikahan: "status_pernikahan",
  jenisKelamin: "jenis_kelamin",
  agama: "agama",
  tanggalLahir: "tanggal_lahir",
  negaraLahir: "negara_lahir",
  provinsiLahir: "provinsi_lahir",
  kotaLahir: "kota_lahir",
  tempatLahirKtp: "tempat_lahir",
  alamatKtp: "alamat_ktp",
  negaraAsal: "negara_asal",
  provinsiAsal: "provinsi_asal",
  kotaAsal: "kota_asal",
  kodePos: "kode_pos",
  alamatDomisili: "alamat_domisili",
  negaraDomisili: "negara_domisili",
  provinsiDomisili: "provinsi_domisili",
  kotaDomisili: "kota_domisili",
  email: "email",
  noHp: "no_hp",
  noKipK: "no_kip_k",
  noBpjs: "no_bpjs",
  sumberInformasi: "sumber_informasi",
  daftarAsrama: "daftar_asrama",
};

export default function DataDiri({ onTersimpan }) {
  return (
    <FormKolom
      bagian={bagian}
      tab="data-diri"
      kunci={kunci}
      onTersimpan={onTersimpan}
      cekTambahan={async () =>
        (await berkasBelumAda(["foto"])).length > 0
          ? "Foto mahasiswa wajib diunggah"
          : null
      }
    />
  );
}
