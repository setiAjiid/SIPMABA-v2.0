import { inisial } from "../../lib/berbagi";

export function JudulSeksi({ judul, keterangan }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-bold tracking-tight text-ink">{judul}</h2>
      {keterangan && <p className="text-sm leading-6 text-muted">{keterangan}</p>}
    </div>
  );
}

// Kartu berisi baris pengguna, dengan catatan opsional di bagian bawah.
export function KartuDaftar({ catatan, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <ul className="divide-y divide-border">{children}</ul>
      {catatan && (
        <p className="border-t border-border bg-background px-6 py-4 text-xs text-muted">
          {catatan}
        </p>
      )}
    </div>
  );
}

export function Avatar({ nama }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand"
    >
      {inisial(nama)}
    </span>
  );
}

export function BarisPengguna({ nama, keterangan, children }) {
  return (
    <li className="flex flex-wrap items-center gap-4 px-6 py-4">
      <Avatar nama={nama} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-sm leading-5 font-bold text-ink">{nama}</p>
        <p className="truncate text-xs text-muted">{keterangan}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">{children}</div>
    </li>
  );
}

export function BarisKosong({ children }) {
  return <li className="px-6 py-8 text-center text-sm text-muted">{children}</li>;
}
