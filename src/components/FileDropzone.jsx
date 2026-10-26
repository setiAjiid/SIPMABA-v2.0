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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-ink">{label}</span>
        {optional && (
          <span className="rounded bg-brand-soft px-2 py-0.5 text-xs text-muted">
            Opsional
          </span>
        )}
      </div>
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
        className={`flex flex-col items-center gap-3 rounded-lg border border-dashed p-6 text-center ${
          error
            ? "border-error"
            : dragging
              ? "border-brand bg-brand-soft"
              : "border-border bg-surface"
        }`}
      >
        <Upload size={20} className="text-muted" />
        {file ? (
          <p className="text-sm text-ink">
            {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
        ) : (
          <p className="text-sm text-muted">
            Tarik berkas ke sini atau pilih berkas
          </p>
        )}
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="text-sm font-semibold text-brand hover:underline"
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
  );
}
