import FormKolom from "../../components/FormKolom";
import KartuBerkas from "../../components/KartuBerkas";

const yaTidak = ["Ya", "Tidak"];
const transportasi = [
  "Kendaraan umum",
  "Kendaraan pribadi",
  "Jalan kaki",
  "Lainnya",
];

const berkas = [
  { id: "ijazah", label: "Ijazah / Surat Keterangan Lulus" },
  { id: "kk", label: "Kartu Keluarga" },
  { id: "akta", label: "Akta Kelahiran" },
  { id: "ktp", label: "KTP" },
  { id: "bpjs", label: "BPJS / asuransi kesehatan", optional: true },
];

const bagian = [
  {
    judul: "Rencana hidup di lokasi pendidikan",
    kolom: [
      {
        nama: "rencanaTempatTinggal",
        label: "Rencana tempat tinggal",
        jenis: "select",
        pilihan: ["Kos/Sewa", "Rumah keluarga", "Asrama", "Lainnya"],
      },
      {
        nama: "adaDukunganKeluarga",
        label: "Ada dukungan keluarga",
        jenis: "radio",
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
        label: "Transportasi sehari-hari",
        jenis: "select",
        pilihan: transportasi,
      },
    ],
  },
  {
    judul: "Catatan khusus",
    kolom: [
      {
        nama: "darah",
        label: "Golongan darah dan rhesus",
        anak: [
          {
            nama: "golonganDarah",
            label: "Golongan darah",
            placeholder: "Golongan darah",
            jenis: "select",
            pilihan: ["A", "B", "AB", "O"],
          },
          {
            nama: "rhesus",
            label: "Rhesus",
            placeholder: "Rhesus",
            jenis: "select",
            pilihan: ["+ (Positif)", "- (Negatif)"],
          },
        ],
      },
      { nama: "kondisiKesehatan", label: "Kondisi kesehatan", opsional: true },
      {
        nama: "disabilitas",
        label: "Disabilitas",
        jenis: "radio",
        pilihan: yaTidak,
      },
    ],
  },
  {
    judul: "Berkas dokumen",
    kustom: (
      <>
        <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
          <p className="text-sm text-muted">JPG atau PNG, maks 500 KB</p>
          <div className="flex items-center gap-3">
            <span className="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">
              Wajib
            </span>
            <span className="text-xs text-muted">Wajib diisi</span>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {berkas.map((b) => (
            <KartuBerkas key={b.id} label={b.label} wajib={!b.optional} />
          ))}
        </div>
      </>
    ),
  },
];

export default function CatatanKhusus() {
  return <FormKolom bagian={bagian} />;
}
