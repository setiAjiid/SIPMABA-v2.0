import { Link } from "react-router-dom";
import { kelengkapan, metode } from "../data/beranda";
import { ambilNama } from "../lib/api";

const warna = {
  AES: "bg-algorithm-aes",
  DES: "bg-algorithm-des",
  RC4: "bg-algorithm-rc4",
};

const kartu = "overflow-hidden rounded-xl border border-border bg-surface";
const judulBagian = "text-xl font-bold text-ink";

export default function Beranda() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex max-w-[960px] flex-col gap-10">
        <div className="flex flex-col gap-2 border-b border-border pb-10">
          <p className="text-sm text-muted">Beranda pendaftaran</p>
          <h1 className="text-4xl font-bold tracking-tight text-ink">
            Halo, {ambilNama() ?? "Pengguna"}
          </h1>
          <p className="text-muted">
            Pantau kelengkapan data dan keamanan dokumen pendaftaran Anda.
          </p>
        </div>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className={judulBagian}>Kelengkapan data</h2>
            <p className="text-sm text-muted">
              Lengkapi informasi berikut sebelum mengirim pendaftaran.
            </p>
          </div>
          <ul className={kartu}>
            {kelengkapan.map((k) => (
              <li
                key={k.nama}
                className="grid grid-cols-[1fr_1.4fr_auto] items-center gap-4 border-t border-border px-6 py-4 text-sm first:border-t-0"
              >
                <span className="font-semibold text-ink">{k.nama}</span>
                {k.simpan ? (
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-success" />
                    <span className="font-semibold text-success">Tersimpan</span>
                    <span className="text-muted">Disimpan {k.simpan}</span>
                  </span>
                ) : (
                  <span className="text-muted">Belum diisi</span>
                )}
                <Link
                  to="/biodata"
                  className="font-bold text-brand hover:underline"
                >
                  {k.simpan ? "Ubah" : "Isi"}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className={judulBagian}>Berkas</h2>
          <div className={`${kartu} flex items-center justify-between p-6`}>
            <div>
              <p className="font-semibold text-ink">Dokumen pendaftaran</p>
              <p className="text-sm text-muted">7 berkas, 4,2 MB</p>
            </div>
            <Link
              to="/berkas"
              className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-bold text-brand hover:bg-brand-soft"
            >
              Kelola berkas
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className={judulBagian}>Enkripsi</h2>
            <p className="text-sm text-muted">
              Metode yang digunakan untuk melindungi data Anda.
            </p>
          </div>
          <div className={kartu}>
            {metode.map((m) => (
              <div
                key={m.kode}
                className="grid grid-cols-3 items-center gap-4 border-t border-border px-6 py-4 text-sm first:border-t-0"
              >
                <span className="flex items-center gap-3 font-semibold text-ink">
                  <span className={`size-2.5 rounded-full ${warna[m.kode]}`} />
                  {m.kode}
                </span>
                <span className="font-semibold text-ink">{m.mode}</span>
                <span className="text-muted">{m.kunci}</span>
              </div>
            ))}
            <p className="border-t border-border bg-background px-6 py-4 text-sm text-muted">
              Kunci diturunkan dari password Anda dan tidak disimpan di server.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
