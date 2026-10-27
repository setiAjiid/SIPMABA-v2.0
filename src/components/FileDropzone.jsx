import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

export default function FileDropzone({
  label,
  hint,
  optional = false,
  accept = ["image/jpeg", "image/png"],
  minKB = 200,
  maxKB = 500,
  jumlah = 1,
  onChange,
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const banyak = jumlah > 1;

  function pilih(daftar) {
    const baru = Array.from(daftar ?? []);
    if (baru.length === 0) return;
    const tujuan = banyak ? baru : baru.slice(0, 1);

    for (const f of tujuan) {
      const kb = f.size / 1024;
      const sebut = banyak ? ` (${f.name})` : "";
      if (!accept.includes(f.type)) {
        setError(`Format berkas tidak sesuai${sebut}`);
        return;
      }
      if (kb < minKB || kb > maxKB) {
        setError(`Ukuran berkas harus ${minKB} sampai ${maxKB} KB${sebut}`);
        return;
      }
    }

    const gabung = banyak ? [...files, ...tujuan] : tujuan;
    if (gabung.length > jumlah) {
      setError(`Maksimal ${jumlah} berkas`);
      return;
    }
    setError("");
    setFiles(gabung);
    onChange?.(banyak ? gabung : gabung[0]);
  }

  function hapus(indeks) {
    const sisa = files.filter((_, i) => i !== indeks);
    setFiles(sisa);
    onChange?.(sisa);
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
            {!banyak && files[0]
              ? `${files[0].name} (${Math.round(files[0].size / 1024)} KB)`
              : "Tarik berkas ke sini atau pilih berkas"}
          </p>
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="h-9 rounded-lg border border-border bg-surface px-4 text-sm font-bold text-brand transition-colors hover:bg-brand-soft"
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
        {error && <p className="text-xs text-error">{error}</p>}

        {banyak && (
          <>
            {files.length > 0 && (
              <ul className="flex flex-col gap-1">
                {files.map((f, i) => (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink"
                  >
                    <span className="truncate">
                      {f.name} ({Math.round(f.size / 1024)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => hapus(i)}
                      aria-label={`Hapus ${f.name}`}
                      className="ml-3 shrink-0 text-error"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs font-semibold text-muted">
              {files.length} dari {jumlah} berkas
            </p>
          </>
        )}
      </div>
    </div>
  );
}
