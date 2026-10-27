import FormKolom from "../../components/FormKolom";

const pekerjaan = [
  "Pegawai Negeri Sipil",
  "Karyawan swasta",
  "Wiraswasta",
  "Guru",
  "Petani",
  "Buruh",
  "Tidak bekerja",
  "Lainnya",
];

const rupiah = { angka: true, satuan: "Rp" };

const bagian = [
  {
    judul: "Pekerjaan saat ini",
    kolom: [
      {
        nama: "pekerjaanAyah",
        label: "Pekerjaan ayah/wali",
        jenis: "select",
        pilihan: pekerjaan,
      },
      {
        nama: "pekerjaanIbu",
        label: "Pekerjaan ibu",
        jenis: "select",
        pilihan: pekerjaan,
      },
    ],
  },
  {
    judul: "Penghasilan",
    kolom: [
      {
        nama: "penghasilanAyah",
        label: "Penghasilan kotor per bulan ayah",
        ...rupiah,
      },
      {
        nama: "penghasilanIbu",
        label: "Penghasilan kotor per bulan ibu",
        ...rupiah,
      },
      {
        nama: "tanggunganAnak",
        label: "Tanggungan anak",
        angka: true,
        satuan: "orang",
      },
    ],
  },
  {
    judul: "Tagihan dan pajak",
    kolom: [
      {
        nama: "tagihanListrik",
        label: "Tagihan listrik sebulan",
        ...rupiah,
      },
      {
        nama: "dayaListrik",
        label: "Daya listrik",
        jenis: "select",
        pilihan: ["450 VA", "900 VA", "1300 VA", "2200 VA", "Di atas 2200 VA"],
      },
      {
        nama: "pajakRodaDua",
        label: "Pajak kendaraan roda dua",
        ...rupiah,
      },
      {
        nama: "pajakRodaEmpat",
        label: "Pajak kendaraan roda empat",
        ...rupiah,
      },
      { nama: "totalPbb", label: "Total PBB", ...rupiah },
    ],
  },
];

export default function Pendukung() {
  return <FormKolom bagian={bagian} />;
}
