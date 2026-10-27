import FormKolom from "../../components/FormKolom";
import { pekerjaan } from "../../data/pekerjaan";

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

const kunci = {
  pekerjaanAyah: "pekerjaan_ayah",
  pekerjaanIbu: "pekerjaan_ibu",
  penghasilanAyah: "penghasilan_ayah",
  penghasilanIbu: "penghasilan_ibu",
  tanggunganAnak: "tanggungan_anak",
  tagihanListrik: "tagihan_listrik",
  dayaListrik: "daya_listrik",
  pajakRodaDua: "pajak_roda_dua",
  pajakRodaEmpat: "pajak_roda_empat",
  totalPbb: "total_pbb",
};

export default function Pendukung() {
  return <FormKolom bagian={bagian} tab="pendukung" kunci={kunci} />;
}
