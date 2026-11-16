import { Moon, Sun } from "lucide-react";
import { gantiTema, useTema } from "../lib/tema";

const gaya = {
  // Di header berwarna brand: garis dan ikon putih.
  header:
    "border-on-brand/70 text-on-brand hover:bg-on-brand/10 focus-visible:outline-on-brand",
  biasa:
    "border-border bg-surface text-ink hover:bg-brand-soft focus-visible:outline-focus",
};

// Mode terang menampilkan bulan (beralih ke gelap), mode gelap menampilkan
// matahari (beralih ke terang).
export default function TombolTema({ varian = "biasa", className = "" }) {
  const gelap = useTema() === "dark";
  const Ikon = gelap ? Sun : Moon;
  const label = gelap ? "Aktifkan mode terang" : "Aktifkan mode gelap";

  return (
    <button
      type="button"
      onClick={gantiTema}
      aria-label={label}
      title={label}
      className={`inline-flex size-[42px] shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${gaya[varian]} ${className}`}
    >
      <Ikon className="size-5" aria-hidden="true" />
    </button>
  );
}
