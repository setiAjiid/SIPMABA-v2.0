import FormKolom from "../../components/FormKolom";
import FileDropzone from "../../components/FileDropzone";

const yaTidak = ["Ya", "Tidak"];
const transportasi = [
  "Kendaraan umum",
  "Kendaraan pribadi",
  "Jalan kaki",
  "Lainnya",
];

const bagian = [
  {
    judul: "Tempat tinggal dan transportasi",
    kolom: [
      {
        nama: "rencanaTempatTinggal",
        label: "Rencana tempat tinggal",
        jenis: "select",
        pilihan: ["Kos atau sewa", "Rumah keluarga", "Asrama", "Lainnya"],
      },
      {
        nama: "adaDukunganKeluarga",
        label: "Ada dukungan keluarga",
        jenis: "select",
        pilihan: yaTidak,
      },
      {
        nama: "transportasiAsal",
        label: "Transportasi dari daerah asal",
        jenis: "select",
        pilihan: transportasi,
      },
      {
        nama: "transportasiHarian",
        label: "Transportasi harian",
        jenis: "select",
        pilihan: transportasi,
      },
    ],
  },
  {
    judul: "Kesehatan",
    kolom: [
      {
        nama: "golonganDarah",
        label: "Golongan darah",
        jenis: "select",
        pilihan: ["A", "B", "AB", "O"],
      },
      {
        nama: "rhesus",
        label: "Rhesus",
        jenis: "select",
        pilihan: ["Positif", "Negatif"],
      },
      { nama: "kondisiKesehatan", label: "Kondisi kesehatan", opsional: true },
      {
        nama: "disabilitas",
        label: "Disabilitas",
        jenis: "select",
        pilihan: yaTidak,
      },
    ],
  },
];

const berkas = [
  { id: "ijazah", label: "Ijazah / Surat Keterangan Lulus" },
  { id: "kk", label: "Kartu Keluarga" },
  { id: "akta", label: "Akta Kelahiran" },
  { id: "ktp", label: "KTP" },
  { id: "bpjs", label: "BPJS / asuransi kesehatan", optional: true },
];

export default function CatatanKhusus() {
  return (
    <FormKolom bagian={bagian}>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-ink">Berkas pendukung</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {berkas.map((b) => (
            <FileDropzone
              key={b.id}
              label={b.label}
              hint="JPG/PNG, maks 500 KB"
              minKB={0}
              optional={b.optional}
            />
          ))}
        </div>
      </section>
    </FormKolom>
  );
}
