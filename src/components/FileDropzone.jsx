import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export default function FileDropzone({
  label,
  hint,
  optional = false,
  accept = ["image/jpeg", "image/png"],
  minKB = 200,
  maxKB = 500,
  onChange,
}) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  function pilih(f) {
    if (!f) return;
    const kb = f.size / 1024;
    if (!accept.includes(f.type)) {
      setError("Format berkas tidak sesuai");
      return;
    }
    if (kb < minKB || kb > maxKB) {
      setError(`Ukuran berkas harus ${minKB} sampai ${maxKB} KB`);
      return;
    }
    setError("");
    setFile(f);
    onChange?.(f);
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
            pilih(e.dataTransfer.files[0]);
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
            {file
              ? `${file.name} (${Math.round(file.size / 1024)} KB)`
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
            accept={accept.join(",")}
            className="hidden"
            onChange={(e) => {
              pilih(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    </div>
  );
}
