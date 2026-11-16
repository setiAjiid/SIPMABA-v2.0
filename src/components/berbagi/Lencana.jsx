const gaya = {
  netral: { kotak: "bg-border px-2.5 py-1", teks: "text-muted", titik: "bg-muted" },
  sukses: {
    kotak: "bg-success/10 px-2.5 py-1",
    teks: "text-success",
    titik: "bg-success",
  },
  galat: { kotak: "bg-error/10 px-2.5 py-1", teks: "text-error", titik: "bg-error" },
};

// Lencana status. Varian "tindakan" tampil tanpa latar untuk status yang
// menunggu langkah dari pengguna sendiri.
export default function Lencana({ varian = "netral", children }) {
  if (varian === "tindakan") {
    return (
      <span className="inline-flex shrink-0 items-center gap-2 text-xs font-bold whitespace-nowrap text-brand">
        <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
        {children}
      </span>
    );
  }
  const g = gaya[varian];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full text-xs font-bold whitespace-nowrap ${g.kotak} ${g.teks}`}
    >
      <span className={`size-1.5 rounded-full ${g.titik}`} aria-hidden="true" />
      {children}
    </span>
  );
}
