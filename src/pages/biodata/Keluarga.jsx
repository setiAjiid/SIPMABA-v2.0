import FormKolom from "../../components/FormKolom";
import { wilayah } from "../../data/wilayah";

const pendidikan = ["SD", "SMP", "SMA", "D3", "S1", "S2", "S3"];

function orangTua(awalan, judul, labelNama) {
  return {
    judul,
    kolom: [
      {
        nama: `${awalan}Nik`,
        label: "NIK",
        pola: /^\d{16}$/,
        galat: "NIK harus 16 digit",
        maks: 16,
        numerik: true,
      },
      { nama: `${awalan}Nama`, label: labelNama },
      { nama: `${awalan}TempatLahir`, label: "Tempat lahir" },
      { nama: `${awalan}TanggalLahir`, label: "Tanggal lahir", tipe: "date" },
      { nama: `${awalan}Pekerjaan`, label: "Pekerjaan" },
      { nama: `${awalan}Instansi`, label: "Instansi" },
      {
        nama: `${awalan}Pendidikan`,
        label: "Pendidikan terakhir",
        jenis: "select",
        pilihan: pendidikan,
      },
      {
        nama: `${awalan}NoHp`,
        label: "Nomor telepon",
        tipe: "tel",
        numerik: true,
      },
      {
        nama: `${awalan}Status`,
        label: "Status",
        jenis: "select",
        pilihan: ["Masih hidup", "Meninggal"],
      },
    ],
  };
}

const bagian = [
  orangTua("ayah", "Data ayah atau wali", "Nama ayah atau wali"),
  orangTua("ibu", "Data ibu", "Nama ibu kandung"),
  {
    judul: "Keluarga",
    kolom: [
      {
        nama: "rangePendapatan",
        label: "Pendapatan orang tua per bulan",
        jenis: "select",
        pilihan: [
          "Kurang dari Rp1.000.000",
          "Rp1.000.001 sampai Rp5.000.000",
          "Rp5.000.001 sampai Rp10.000.000",
          "Lebih dari Rp10.000.000",
        ],
      },
      {
        nama: "nomorKk",
        label: "Nomor Kartu Keluarga",
        pola: /^\d{16}$/,
        galat: "Nomor KK harus 16 digit",
        maks: 16,
        numerik: true,
      },
      { nama: "jumlahKakak", label: "Jumlah kakak", angka: true },
      { nama: "jumlahAdik", label: "Jumlah adik", angka: true },
    ],
  },
  {
    judul: "Alamat orang tua",
    kolom: [
      { nama: "alamatOrtu", label: "Alamat" },
      {
        nama: "rt",
        label: "RT",
        pola: /^\d{1,3}$/,
        galat: "RT berupa angka",
        maks: 3,
        numerik: true,
      },
      {
        nama: "rw",
        label: "RW",
        pola: /^\d{1,3}$/,
        galat: "RW berupa angka",
        maks: 3,
        numerik: true,
      },
      { nama: "kelurahan", label: "Kelurahan" },
      { nama: "kecamatan", label: "Kecamatan" },
      {
        nama: "provinsiOrtu",
        label: "Provinsi",
        jenis: "select",
        pilihan: Object.keys(wilayah),
      },
      {
        nama: "kotaOrtu",
        label: "Kota",
        jenis: "select",
        bergantung: "provinsiOrtu",
        pilihan: (f) => wilayah[f.provinsiOrtu] ?? [],
      },
      {
        nama: "kodePosOrtu",
        label: "Kode pos",
        pola: /^\d{5}$/,
        galat: "Kode pos harus 5 digit",
        maks: 5,
        numerik: true,
      },
      {
        nama: "teleponRumah",
        label: "Nomor telepon rumah",
        opsional: true,
        tipe: "tel",
        numerik: true,
      },
    ],
  },
];

export default function Keluarga() {
  return <FormKolom bagian={bagian} />;
}
