const latar = {
  AES: "bg-algorithm-aes",
  DES: "bg-algorithm-des",
  RC4: "bg-algorithm-rc4",
};

export function ChipAlgoritma({ algoritma }) {
  return (
    <span
      className={`rounded px-2 py-1 text-xs font-bold text-surface ${latar[algoritma]}`}
    >
      {algoritma}
    </span>
  );
}

// Teks sidik kunci atau ciphertext.
export function Kode({ className = "", children }) {
  return (
    <span className={`font-mono text-xs break-all text-ink ${className}`}>
      {children}
    </span>
  );
}

// Kartu berisi baris label dan nilai, dengan catatan opsional di bawah.
// `children` berisi BarisRincian; `tambahan` tampil di bawah baris.
export function KartuRincian({ tambahan, catatan, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <dl className="divide-y divide-border">{children}</dl>
      {tambahan && <div className="border-t border-border">{tambahan}</div>}
      {catatan && (
        <p className="border-t border-border bg-background px-6 py-4 text-xs text-muted">
          {catatan}
        </p>
      )}
    </div>
  );
}

export function BarisRincian({ label, tebal = false, children }) {
  return (
    <div className="flex flex-col gap-1 px-6 py-4 text-sm sm:flex-row sm:items-center sm:gap-6">
      <dt className="shrink-0 leading-6 text-muted sm:w-[200px]">{label}</dt>
      <dd
        className={`flex min-w-0 flex-1 flex-wrap items-center gap-3 text-ink ${
          tebal ? "leading-5 font-bold" : "leading-6"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}
