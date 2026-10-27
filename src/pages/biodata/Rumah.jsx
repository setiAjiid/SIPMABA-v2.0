import FormKolom from "../../components/FormKolom";

const petunjukAngka = "Isi bilangan bulat, tanpa titik";

const bagian = [
  {
    judul: "Data rumah",
    kolom: [
      {
        nama: "kepemilikan",
        label: "Kepemilikan",
        jenis: "select",
        pilihan: [
          "Milik sendiri",
          "Sewa atau kontrak",
          "Milik keluarga",
          "Rumah dinas",
        ],
      },
      {
        nama: "tahunPerolehan",
        label: "Tahun perolehan",
        pola: /^\d{4}$/,
        galat: "Tahun harus 4 digit",
        maks: 4,
        numerik: true,
      },
      {
        nama: "sumberListrik",
        label: "Sumber listrik",
        jenis: "select",
        pilihan: [
          "PLN 450 VA",
          "PLN 900 VA",
          "PLN 1.300 VA",
          "PLN 2.200 VA",
          "Non-PLN",
        ],
      },
      {
        nama: "luasTanah",
        label: "Luas tanah",
        angka: true,
        satuan: "m²",
        petunjuk: petunjukAngka,
      },
      {
        nama: "luasBangunan",
        label: "Luas bangunan",
        angka: true,
        satuan: "m²",
        petunjuk: petunjukAngka,
      },
      {
        nama: "njop",
        label: "NJOP",
        angka: true,
        satuan: "Rp",
        petunjuk: petunjukAngka,
      },
      {
        nama: "mck",
        label: "Mandi cuci kakus (MCK)",
        jenis: "select",
        pilihan: [
          "Milik sendiri di dalam rumah",
          "Milik sendiri di luar rumah",
          "Umum",
        ],
      },
      {
        nama: "sumberAir",
        label: "Sumber air minum",
        jenis: "select",
        pilihan: ["Air isi ulang", "PDAM", "Sumur", "Lainnya"],
      },
      {
        nama: "jarakPusatKota",
        label: "Jarak dari pusat kab/kota",
        angka: true,
        satuan: "km",
        petunjuk: petunjukAngka,
      },
      {
        nama: "jumlahPenghuni",
        label: "Jumlah orang tinggal",
        angka: true,
        min: 1,
      },
    ],
  },
];

export default function Rumah() {
  return <FormKolom bagian={bagian} />;
}
