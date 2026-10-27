import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { ALGORITMA, formatUkuran } from "../lib/berkas";

const latar = {
  AES: "bg-algorithm-aes",
  DES: "bg-algorithm-des",
  RC4: "bg-algorithm-rc4",
};

// terunggah: berkas milik kotak ini yang sudah tersimpan di server.
// onUnggah(file, lapor) dan onHapus(berkas) dipanggil satu per satu dan
// boleh melempar galat; pesannya ditampilkan di bawah kotak. lapor(teks)
// untuk progres. onUnduh(berkas, algoritma, lapor) opsional, menampilkan
// tombol unduh dengan pilihan algoritma.
export default function FileDropzone({
  label,
  hint,
  optional = false,
  accept = ["image/jpeg", "image/png"],
  minKB = 0,
  maxKB = 500,
  jumlah = 1,
  terunggah = [],
  onUnggah,
  onHapus,
  onUnduh,
  tidakTersedia,
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [sibuk, setSibuk] = useState(false);
  const [progres, setProgres] = useState("");
  const [algoritma, setAlgoritma] = useState("AES");
  const banyak = jumlah > 1;

  async function pilih(daftar) {
    const baru = Array.from(daftar ?? []);
    if (baru.length === 0 || sibuk || tidakTersedia) return;
    const tujuan = banyak ? baru : baru.slice(0, 1);

    for (const f of tujuan) {
      const kb = f.size / 1024;
      const sebut = banyak ? ` (${f.name})` : "";
      if (!accept.includes(f.type)) {
        setError(`Format berkas tidak sesuai${sebut}`);
        return;
      }
      if (f.size === 0 || kb < minKB || kb > maxKB) {
        setError(
          minKB > 0
            ? `Ukuran berkas harus ${minKB} sampai ${maxKB} KB${sebut}`
            : `Ukuran berkas maksimal ${maxKB} KB${sebut}`,
        );
        return;
      }
      if (
        banyak &&
        terunggah.some((b) => b.nama_asli === f.name && b.ukuran_byte === f.size)
      ) {
        setError(`Berkas itu sudah ada dalam daftar${sebut}`);
        return;
      }
    }
    if (banyak && terunggah.length + tujuan.length > jumlah) {
      setError(`Maksimal ${jumlah} berkas`);
      return;
    }

    setError("");
    setSibuk(true);
    try {
      for (const f of tujuan) await onUnggah?.(f, setProgres);
    } catch (err) {
      setError(err.message);
    } finally {
      setSibuk(false);
      setProgres("");
    }
  }

  async function jalankan(aksi) {
    setSibuk(true);
    setError("");
    try {
      await aksi();
    } catch (err) {
      setError(err.message);
    } finally {
      setSibuk(false);
      setProgres("");
    }
  }

  return (
    <div className="grid gap-4 rounded-xl border border-border bg-surface p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-ink">{label}</span>
        {optional && (
          <span className="text-xs font-semibold text-muted">Opsional</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted">{hint}</p>
        {tidakTersedia ? (
          <p className="rounded-lg border border-dashed border-border bg-background px-4 py-6 text-center text-sm text-muted">
            {tidakTersedia}
          </p>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pilih(e.dataTransfer.files);
            }}
            className={`flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-8 text-center ${
              error
                ? "border-error bg-background"
                : dragging
                  ? "border-brand bg-brand-soft"
                  : "border-border bg-background"
            }`}
          >
            <Upload size={18} className="text-brand" />
            <p className="text-sm font-semibold text-ink">
              {sibuk
                ? progres || "Mengenkripsi dan menyimpan..."
                : !banyak && terunggah[0]
                  ? "Pilih berkas lain untuk mengganti"
                  : "Tarik berkas ke sini atau pilih berkas"}
            </p>
            <button
              type="button"
              disabled={sibuk}
              onClick={() => inputRef.current.click()}
              className="h-9 rounded-lg border border-border bg-surface px-4 text-sm font-bold text-brand transition-colors hover:bg-brand-soft disabled:opacity-60"
            >
              Pilih berkas
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple={banyak}
              accept={accept.join(",")}
              className="hidden"
              onChange={(e) => {
                pilih(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        )}
        {error && <p className="text-xs text-error">{error}</p>}
        {sibuk && progres && terunggah.length > 0 && (
          <p className="text-xs text-muted">{progres}</p>
        )}

        {terunggah.length > 0 && (
          <ul className="flex flex-col gap-1">
            {terunggah.map((b) => (
              <li
                key={b.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink"
              >
                <span className="min-w-0 flex-1 truncate">
                  {b.nama_asli} ({formatUkuran(b.ukuran_byte)})
                  {b.status === "mengunggah" && (
                    <span className="text-error"> belum selesai</span>
                  )}
                </span>
                {b.status !== "mengunggah" && (
                  <span className="flex shrink-0 gap-1">
                    {ALGORITMA.map((a) => (
                      <span
                        key={a}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-surface ${latar[a]}`}
                      >
                        {a}
                      </span>
                    ))}
                  </span>
                )}
                {onUnduh && b.status !== "mengunggah" && (
                  <span className="flex shrink-0 items-center gap-1">
                    <select
                      aria-label={`Algoritma unduhan ${b.nama_asli}`}
                      value={algoritma}
                      onChange={(e) => setAlgoritma(e.target.value)}
                      className="h-7 rounded border border-border bg-surface px-1 text-xs"
                    >
                      {ALGORITMA.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={sibuk}
                      onClick={() =>
                        jalankan(() => onUnduh(b, algoritma, setProgres))
                      }
                      className="h-7 rounded bg-brand px-2 font-semibold text-surface disabled:opacity-60"
                    >
                      Unduh
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  disabled={sibuk}
                  onClick={() => jalankan(() => onHapus?.(b))}
                  aria-label={`Hapus ${b.nama_asli}`}
                  className="shrink-0 text-error disabled:opacity-60"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {banyak && (
          <p className="text-xs font-semibold text-muted">
            {terunggah.length} dari {jumlah} berkas
          </p>
        )}
      </div>
    </div>
  );
}
