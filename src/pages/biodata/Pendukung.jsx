import FormKolom from "../../components/FormKolom";

const bagian = [
  {
    judul: "Pekerjaan dan penghasilan orang tua",
    kolom: [
      { nama: "pekerjaanAyah", label: "Pekerjaan ayah" },
      { nama: "pekerjaanIbu", label: "Pekerjaan ibu" },
      {
        nama: "penghasilanAyah",
        label: "Penghasilan ayah per bulan (Rp)",
        angka: true,
      },
      {
        nama: "penghasilanIbu",
        label: "Penghasilan ibu per bulan (Rp)",
        angka: true,
      },
      { nama: "tanggunganAnak", label: "Jumlah tanggungan anak", angka: true },
    ],
  },
  {
    judul: "Listrik dan pajak",
    kolom: [
      {
        nama: "tagihanListrik",
        label: "Tagihan listrik per bulan (Rp)",
        angka: true,
      },
      {
        nama: "dayaListrik",
        label: "Daya listrik",
        placeholder: "Contoh: 1300 VA",
      },
      {
        nama: "pajakRodaDua",
        label: "Pajak kendaraan roda dua (Rp)",
        angka: true,
      },
      {
        nama: "pajakRodaEmpat",
        label: "Pajak kendaraan roda empat (Rp)",
        angka: true,
      },
      { nama: "totalPbb", label: "Total PBB (Rp)", angka: true },
    ],
  },
];

export default function Pendukung() {
  return <FormKolom bagian={bagian} />;
}
