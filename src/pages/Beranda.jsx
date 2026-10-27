import { Link } from "react-router-dom";
import { CircleCheck, Circle } from "lucide-react";
import { kelengkapan, metode } from "../data/beranda";

const warna = {
  AES: "bg-algorithm-aes",
  DES: "bg-algorithm-des",
  RC4: "bg-algorithm-rc4",
};

export default function Beranda() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold tracking-widest text-muted">
          BERANDA PENDAFTARAN
        </p>
        <h1 className="text-2xl font-bold text-ink">Halo, Pengguna</h1>
        <p className="text-sm text-muted">
          Pantau kelengkapan data dan keamanan dokumen pendaftaran Anda.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-card lg:col-span-2">
          <div>
            <h2 className="text-lg font-bold text-ink">Kelengkapan data</h2>
            <p className="text-sm text-muted">
              Lengkapi informasi berikut sebelum mengirim pendaftaran.
            </p>
          </div>
          <ul className="flex flex-col">
            {kelengkapan.map((k) => (
              <li
                key={k.nama}
                className="flex items-center gap-3 border-t border-border py-3 first:border-t-0"
              >
                {k.simpan ? (
                  <CircleCheck size={20} className="text-success" />
                ) : (
                  <Circle size={20} className="text-muted" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{k.nama}</p>
                  <p className="text-xs text-muted">
                    {k.simpan ? `Disimpan ${k.simpan}` : "Belum diisi"}
                  </p>
                </div>
                <Link
                  to="/biodata"
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  {k.simpan ? "Ubah" : "Isi"}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-3 rounded-2xl bg-surface p-6 shadow-card">
            <h2 className="text-lg font-bold text-ink">Berkas</h2>
            <div>
              <p className="text-sm font-semibold text-ink">
                Dokumen pendaftaran
              </p>
              <p className="text-xs text-muted">7 berkas, 4,2 MB</p>
            </div>
            <Link
              to="/berkas"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border text-sm font-bold text-brand hover:bg-brand-soft"
            >
              Kelola berkas
            </Link>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl bg-surface p-6 shadow-card">
            <div>
              <h2 className="text-lg font-bold text-ink">Enkripsi</h2>
              <p className="text-sm text-muted">
                Metode yang digunakan untuk melindungi data Anda.
              </p>
            </div>
            {metode.map((m) => (
              <div key={m.kode} className="flex items-center gap-3">
                <span className={`h-8 w-1.5 rounded ${warna[m.kode]}`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{m.kode}</p>
                  <p className="text-xs text-muted">{m.mode}</p>
                </div>
                <span className="text-xs text-muted">{m.kunci}</span>
              </div>
            ))}
            <p className="text-xs text-muted">
              Kunci diturunkan dari password Anda dan tidak disimpan di server.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
