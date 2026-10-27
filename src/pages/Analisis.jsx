import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { berkasTerenkripsi, hasilContoh } from "../data/analisis";

const warna = {
  AES: "bg-algorithm-aes",
  DES: "bg-algorithm-des",
  RC4: "bg-algorithm-rc4",
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

export default function Analisis() {
  const [dipilih, setDipilih] = useState(berkasTerenkripsi[0].id);
  const [percobaan, setPercobaan] = useState("20");
  const [hasil, setHasil] = useState(null);

  function jalankan() {
    // sementara memakai data contoh, nanti diganti pemanggilan backend
    setHasil(hasilContoh);
  }

  const terlama = hasil ? Math.max(...hasil.map((h) => h.rata)) : 1;
  const berkas = berkasTerenkripsi.find((b) => b.id === dipilih);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12">
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold tracking-widest text-muted">
          BERKAS TERENKRIPSI
        </h2>
        {berkasTerenkripsi.map((b) => (
          <label
            key={b.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 text-sm"
          >
            <input
              type="radio"
              name="berkas"
              checked={dipilih === b.id}
              onChange={() => setDipilih(b.id)}
            />
            <span className="flex-1 text-ink">{b.nama}</span>
            <span className="text-muted">{b.ukuran}</span>
          </label>
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-card">
        <div>
          <h2 className="text-lg font-bold text-ink">Uji kecepatan dekripsi</h2>
          <p className="text-sm text-muted">
            Bandingkan performa dekripsi berkas dengan tiga algoritma.
          </p>
        </div>
        <div className="flex items-end gap-4">
          <div className="w-40">
            <Input
              label="Jumlah percobaan"
              inputMode="numeric"
              value={percobaan}
              onChange={(e) => setPercobaan(e.target.value)}
            />
          </div>
          <Button type="button" onClick={jalankan}>
            Jalankan uji
          </Button>
        </div>
      </section>

      {hasil && (
        <>
          <section className="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-card">
            <div>
              <h2 className="text-lg font-bold text-ink">
                Rata-rata waktu dekripsi
              </h2>
              <p className="text-sm text-muted">
                Garis batas menunjukkan simpangan baku.
              </p>
            </div>
            {hasil.map((h) => (
              <div
                key={h.algoritma}
                className="flex items-center gap-3 text-sm"
              >
                <span className="w-10 font-semibold text-ink">
                  {h.algoritma}
                </span>
                <div className="h-6 flex-1 rounded bg-brand-soft">
                  <div
                    className={`h-6 rounded ${warna[h.algoritma]}`}
                    style={{ width: `${(h.rata / terlama) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-right text-ink">
                  {h.rata.toFixed(2)} ms
                </span>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-card">
            <div>
              <h2 className="text-lg font-bold text-ink">
                Statistik hasil uji
              </h2>
              <p className="text-sm text-muted">
                {berkas.nama} · {percobaan} percobaan
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    {kolom.map((k) => (
                      <th key={k} className="px-3 py-2 font-semibold">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-ink">
                  {hasil.map((h) => (
                    <tr key={h.algoritma} className="border-t border-border">
                      <td className="px-3 py-2 font-semibold">{h.algoritma}</td>
                      <td className="px-3 py-2">{h.mode}</td>
                      <td className="px-3 py-2">{h.rata.toFixed(2)}</td>
                      <td className="px-3 py-2">{h.median.toFixed(2)}</td>
                      <td className="px-3 py-2">{h.sd.toFixed(2)}</td>
                      <td className="px-3 py-2">{h.min.toFixed(2)}</td>
                      <td className="px-3 py-2">{h.maks.toFixed(2)}</td>
                      <td className="px-3 py-2">{h.ukuran}</td>
                      <td className="px-3 py-2">{h.selisih}</td>
                      <td className="px-3 py-2">{h.mbps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted">
              DES dan RC4 tidak aman. Keduanya dipakai karena diwajibkan tugas.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
