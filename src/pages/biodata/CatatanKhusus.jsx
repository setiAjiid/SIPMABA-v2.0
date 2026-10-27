import FormKolom from "../../components/FormKolom";
import KartuBerkas from "../../components/KartuBerkas";
import { yaTidak } from "../../lib/biodata";
import {
  berkasBelumAda,
  hapusBerkas,
  unggahBerkas,
  useDaftarBerkas,
} from "../../lib/berkas";

const transportasi = [
  "Kendaraan umum",
  "Kendaraan pribadi",
  "Jalan kaki",
  "Lainnya",
];

const berkas = [
  { kode: "ijazah_skl", label: "Ijazah / Surat Keterangan Lulus" },
  { kode: "kartu_keluarga", label: "Kartu Keluarga" },
  { kode: "akta_kelahiran", label: "Akta Kelahiran" },
  { kode: "ktp", label: "KTP" },
  { kode: "bpjs", label: "BPJS / asuransi kesehatan", optional: true },
];

// Kartu Keluarga dan Akta Kelahiran memakai kode yang sama dengan halaman
// Berkas, jadi unggahan di salah satu tempat terlihat di tempat lain.
function BerkasDokumen() {
  const [daftar, muatUlang] = useDaftarBerkas();
  const cari = (kode) => daftar?.berkas.find((x) => x.kode_berkas === kode);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {berkas.map((b) => (
        <KartuBerkas
          key={b.kode}
          label={b.label}
          wajib={!b.optional}
          berkas={cari(b.kode)}
          onUnggah={async (file) => {
            await unggahBerkas(b.kode, file);
            muatUlang();
          }}
          onHapus={async (x) => {
            await hapusBerkas(x.id);
            muatUlang();
          }}
        />
      ))}
    </div>
  );
}

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
        boolean: true,
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
            pilihan: [
              { nilai: "positif", label: "+ (Positif)" },
              { nilai: "negatif", label: "- (Negatif)" },
            ],
          },
        ],
      },
      { nama: "kondisiKesehatan", label: "Kondisi kesehatan", opsional: true },
      {
        nama: "disabilitas",
        label: "Disabilitas",
        jenis: "radio",
        pilihan: yaTidak,
        boolean: true,
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
        <BerkasDokumen />
      </>
    ),
  },
];

const kunci = {
  rencanaTempatTinggal: "rencana_tempat_tinggal",
  adaDukunganKeluarga: "ada_dukungan_keluarga",
  transportasiAsal: "transportasi_dari_asal",
  transportasiHarian: "transportasi_harian",
  golonganDarah: "golongan_darah",
  rhesus: "rhesus",
  kondisiKesehatan: "kondisi_kesehatan",
  disabilitas: "disabilitas",
};

export default function CatatanKhusus({ onTersimpan }) {
  return (
    <FormKolom
      bagian={bagian}
      tab="catatan-khusus"
      kunci={kunci}
      onTersimpan={onTersimpan}
      cekTambahan={async () => {
        const wajib = berkas.filter((b) => !b.optional);
        const kurang = await berkasBelumAda(wajib.map((b) => b.kode));
        if (kurang.length === 0) return null;
        const nama = wajib.filter((b) => kurang.includes(b.kode)).map((b) => b.label);
        return `Berkas wajib belum diunggah: ${nama.join(", ")}`;
      }}
    />
  );
}
