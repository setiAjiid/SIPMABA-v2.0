import FormKolom from "../../components/FormKolom";
import { wilayah } from "../../data/wilayah";
import { pekerjaan } from "../../data/pekerjaan";

const pendidikan = ["SD", "SMP", "SMA", "D3", "S1", "S2", "S3"];

function orangTua(awalan, judul, labelNik, labelNama) {
  return {
    judul,
    kolom: [
      {
        nama: `${awalan}Nik`,
        label: labelNik,
        pola: /^\d{16}$/,
        galat: "NIK harus 16 digit",
        maks: 16,
        numerik: true,
        petunjuk: "16 digit",
      },
      { nama: `${awalan}Nama`, label: labelNama },
      {
        nama: `${awalan}Kelahiran`,
        label: "Tempat dan tanggal lahir",
        anak: [
          {
            nama: `${awalan}TempatLahir`,
            label: "Tempat lahir",
            placeholder: "Tempat lahir",
          },
          {
            nama: `${awalan}TanggalLahir`,
            label: "Tanggal lahir",
            tipe: "date",
          },
        ],
      },
      {
        nama: `${awalan}Pekerjaan`,
        label: "Pekerjaan",
        jenis: "select",
        pilihan: pekerjaan,
      },
      { nama: `${awalan}Instansi`, label: "Instansi" },
      {
        nama: `${awalan}Pendidikan`,
        label: "Pendidikan terakhir",
        jenis: "select",
        pilihan: pendidikan,
      },
      {
        nama: `${awalan}NoHp`,
        label: "No. HP",
        tipe: "tel",
        numerik: true,
      },
      {
        nama: `${awalan}Status`,
        label: "Status",
        jenis: "radio",
        pilihan: [
          { nilai: "masih_hidup", label: "Masih hidup" },
          { nilai: "meninggal", label: "Meninggal" },
        ],
      },
    ],
  };
}

const bagian = [
  orangTua("ayah", "Ayah / wali", "NIK Ayah", "Nama ayah/wali"),
  orangTua("ibu", "Ibu", "NIK Ibu", "Nama ibu kandung"),
  {
    judul: "Keluarga",
    kolom: [
      {
        nama: "rangePendapatan",
        label: "Range pendapatan orang tua per bulan",
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
        label: "Nomor KK",
        pola: /^\d{16}$/,
        galat: "Nomor KK harus 16 digit",
        maks: 16,
        numerik: true,
        petunjuk: "16 digit",
      },
      { nama: "jumlahKakak", label: "Jumlah kakak", angka: true },
      { nama: "jumlahAdik", label: "Jumlah adik", angka: true },
    ],
  },
  {
    judul: "Alamat orang tua / wali",
    kolom: [
      { nama: "alamatOrtu", label: "Alamat", jenis: "area" },
      {
        nama: "rtRw",
        label: "RT / RW",
        pemisah: "/",
        anak: [
          {
            nama: "rt",
            label: "RT",
            pola: /^\d{1,3}$/,
            galat: "RT berupa angka",
            maks: 3,
            padKiri: 3,
            numerik: true,
          },
          {
            nama: "rw",
            label: "RW",
            pola: /^\d{1,3}$/,
            galat: "RW berupa angka",
            maks: 3,
            padKiri: 3,
            numerik: true,
          },
        ],
      },
      { nama: "kelurahan", label: "Kelurahan" },
      { nama: "kecamatan", label: "Kecamatan" },
      {
        nama: "wilayahOrtu",
        label: "Kota",
        anak: [
          {
            nama: "provinsiOrtu",
            label: "Provinsi",
            placeholder: "Provinsi",
            jenis: "select",
            pilihan: Object.keys(wilayah),
          },
          {
            nama: "kotaOrtu",
            label: "Kota",
            placeholder: "Kota",
            jenis: "select",
            bergantung: "provinsiOrtu",
            pilihan: (f) => wilayah[f.provinsiOrtu] ?? [],
          },
        ],
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
        label: "No. telepon rumah",
        opsional: true,
        tipe: "tel",
        numerik: true,
      },
    ],
  },
];

const kolomOrangTua = {
  Nik: "nik",
  Nama: "nama",
  TempatLahir: "tempat_lahir",
  TanggalLahir: "tanggal_lahir",
  Pekerjaan: "pekerjaan",
  Instansi: "instansi",
  Pendidikan: "pendidikan_terakhir",
  NoHp: "no_hp",
  Status: "status",
};

const kunci = {
  ...Object.fromEntries(
    ["ayah", "ibu"].flatMap((awalan) =>
      Object.entries(kolomOrangTua).map(([akhiran, field]) => [
        `${awalan}${akhiran}`,
        `${awalan}.${field}`,
      ]),
    ),
  ),
  rangePendapatan: "range_pendapatan_ortu",
  nomorKk: "nomor_kk",
  jumlahKakak: "jumlah_kakak",
  jumlahAdik: "jumlah_adik",
  alamatOrtu: "alamat_ortu.alamat",
  rt: "alamat_ortu.rt",
  rw: "alamat_ortu.rw",
  kelurahan: "alamat_ortu.kelurahan",
  kecamatan: "alamat_ortu.kecamatan",
  provinsiOrtu: "alamat_ortu.provinsi",
  kotaOrtu: "alamat_ortu.kota",
  kodePosOrtu: "alamat_ortu.kode_pos",
  teleponRumah: "alamat_ortu.no_telepon_rumah",
};

export default function Keluarga() {
  return <FormKolom bagian={bagian} tab="keluarga" kunci={kunci} />;
}
