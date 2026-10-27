import { useState } from "react";
import { FileText } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import SidebarLayout from "../layouts/SidebarLayout";
import { berkasTerenkripsi, hasilContoh } from "../data/analisis";

const latar = {
  AES: "bg-algorithm-aes",
  DES: "bg-algorithm-des",
  RC4: "bg-algorithm-rc4",
};
const teks = {
  AES: "text-algorithm-aes",
  DES: "text-algorithm-des",
  RC4: "text-algorithm-rc4",
};

const kolom = [
  "Algoritma",
  "Mode",
  "Rata-rata (ms)",
  "Median",
  "Simpangan baku",
  "Min",
  "Maks",
  "Ukuran ciphertext",
  "Selisih ukuran",
  "MB/s",
];

const baris = (h) => [
  h.algoritma,
  h.mode,
  h.rata.toFixed(2),
  h.median.toFixed(2),
  h.sd.toFixed(2),
  h.min.toFixed(2),
  h.maks.toFixed(2),
  h.ukuran,
  h.selisih,
  h.mbps,
];

const kartu = "rounded-xl border border-border bg-surface";

export default function Analisis() {
  const [dipilih, setDipilih] = useState(berkasTerenkripsi[0].id);
  const [percobaan, setPercobaan] = useState("20");
  const [galat, setGalat] = useState("");
  const [hasil, setHasil] = useState(null);
  const [tersalin, setTersalin] = useState(false);

  const berkas = berkasTerenkripsi.find((b) => b.id === dipilih);

  function pilihBerkas(id) {
    setDipilih(id);
    setHasil(null);
  }

  function jalankan() {
    if (!/^\d+$/.test(percobaan) || Number(percobaan) < 1) {
      setGalat("Jumlah percobaan harus bilangan bulat minimal 1");
      return;
    }
    setGalat("");
    // sementara memakai data contoh, nanti diganti pemanggilan backend
    setHasil({ data: hasilContoh, berkas: berkas.nama, percobaan });
  }

  async function salin() {
    const tabel = [
      `| ${kolom.join(" | ")} |`,
      `| ${kolom.map(() => "---").join(" | ")} |`,
      ...hasil.data.map((h) => `| ${baris(h).join(" | ")} |`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(tabel);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch {
      setTersalin(false);
    }
  }

  const skala = hasil
    ? Math.max(...hasil.data.map((h) => h.rata + h.sd)) * 1.1
    : 1;

  const daftar = (
    <div
      role="radiogroup"
      aria-label="Berkas terenkripsi"
      className="flex flex-col gap-2"
    >
      {berkasTerenkripsi.map((b) => {
        const aktif = dipilih === b.id;
        return (
          <button
            key={b.id}
            type="button"
            role="radio"
            aria-checked={aktif}
            onClick={() => pilihBerkas(b.id)}
            className={`flex w-full items-start gap-3 rounded-lg border-2 px-3 py-3 text-left ${
              aktif
                ? "border-brand font-semibold text-brand"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <FileText
              size={18}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm">{b.nama}</span>
              <span className="block text-xs font-normal text-muted">
                {b.ukuran}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <SidebarLayout judul="BERKAS TERENKRIPSI" samping={daftar}>
      <div className="mx-auto flex max-w-[876px] flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Uji kecepatan dekripsi
          </h1>
          <p className="text-sm text-muted">
            Bandingkan performa dekripsi berkas dengan tiga algoritma.
          </p>
        </header>

        <section className={`${kartu} p-6`}>
          <div className="flex items-start gap-4">
            <div className="w-80">
              <Input
                label="Jumlah percobaan"
                inputMode="numeric"
                value={percobaan}
                onChange={(e) => setPercobaan(e.target.value)}
                error={galat}
              />
            </div>
            <Button type="button" onClick={jalankan} className="mt-7">
              Jalankan uji
            </Button>
          </div>
        </section>

        {!hasil && (
          <p className="text-sm text-muted">
            Pilih berkas lalu jalankan uji untuk melihat hasilnya.
          </p>
        )}

        {hasil && (
          <>
            <section className={`${kartu} p-8`}>
              <h2 className="text-lg font-bold text-ink">
                Rata-rata waktu dekripsi
              </h2>
              <p className="text-xs text-muted">
                Garis batas menunjukkan simpangan baku.
              </p>
              <div className="mt-6 flex flex-col gap-5">
                {hasil.data.map((h) => (
                  <div key={h.algoritma} className="flex items-center gap-4">
                    <span
                      className={`w-12 text-sm font-bold ${teks[h.algoritma]}`}
                    >
                      {h.algoritma}
                    </span>
                    <div className="relative h-10 flex-1 rounded-lg bg-background">
                      <div
                        className={`h-full rounded-lg ${latar[h.algoritma]}`}
                        style={{ width: `${(h.rata / skala) * 100}%` }}
                      />
                      <div
                        className="absolute top-1/2 h-4 -translate-y-1/2 border-x-2 border-ink"
                        style={{
                          left: `${((h.rata - h.sd) / skala) * 100}%`,
                          width: `${((2 * h.sd) / skala) * 100}%`,
                        }}
                      >
                        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-ink" />
                      </div>
                      <span
                        className="absolute inset-y-0 flex items-center text-sm font-bold text-ink"
                        style={{
                          left: `calc(${((h.rata + h.sd) / skala) * 100}% + 12px)`,
                        }}
                      >
                        {h.rata.toFixed(2)} ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${kartu} overflow-hidden`}>
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <h2 className="text-lg font-bold text-ink">
                    Statistik hasil uji
                  </h2>
                  <p className="text-xs text-muted">
                    {hasil.berkas} · {hasil.percobaan} percobaan
                  </p>
                </div>
                <Button type="button" variant="secondary" onClick={salin}>
                  {tersalin ? "Tabel tersalin" : "Salin sebagai tabel Markdown"}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-left text-xs">
                  <thead className="bg-background text-muted">
                    <tr>
                      {kolom.map((k) => (
                        <th key={k} className="px-4 py-3 font-semibold">
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-ink">
                    {hasil.data.map((h) => (
                      <tr key={h.algoritma} className="border-t border-border">
                        {baris(h).map((nilai, i) => (
                          <td
                            key={kolom[i]}
                            className={`px-4 py-4 ${
                              i === 0
                                ? `font-bold ${teks[h.algoritma]}`
                                : i === 1
                                  ? "font-bold"
                                  : ""
                            }`}
                          >
                            {nilai}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="border-l-2 border-error pl-4 text-xs text-muted">
              DES dan RC4 tidak aman. Keduanya dipakai karena diwajibkan tugas.
            </p>
          </>
        )}
      </div>
    </SidebarLayout>
  );
}
