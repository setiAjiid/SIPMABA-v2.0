import { useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";

const algoritma = ["AES", "DES", "RC4"];
const latar = {
  AES: "bg-algorithm-aes",
  DES: "bg-algorithm-des",
  RC4: "bg-algorithm-rc4",
};
const teks = {
  AES: "text-algorithm-aes",
  DES: "text-algorithm-des",
  RC4: "text-algorithm-rc4",
};

export default function KartuBerkas({ label, wajib = false, onChange }) {
  const inputRef = useRef(null);
  const [berkas, setBerkas] = useState(null);
  const [galat, setGalat] = useState("");
  const [seret, setSeret] = useState(false);
  const [pilihan, setPilihan] = useState("AES");

  function pilih(f) {
    if (!f) return;
    if (!["image/jpeg", "image/png"].includes(f.type)) {
      setGalat("Format berkas harus JPG atau PNG");
      return;
    }
    if (f.size > 500 * 1024) {
      setGalat("Ukuran berkas maksimal 500 KB");
      return;
    }
    setGalat("");
    setBerkas(f);
    onChange?.(f);
  }

  function hapus() {
    setBerkas(null);
    setGalat("");
    onChange?.(null);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between bg-background px-4 py-3">
        <h3 className="text-sm font-semibold text-ink">{label}</h3>
        {wajib ? (
          <span className="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">
            Wajib
          </span>
        ) : (
          <span className="text-xs text-muted">Opsional</span>
        )}
      </div>

      <div className="p-4">
        {berkas ? (
          <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 p-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface text-success">
              <FileText size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {berkas.name}
              </p>
              <p className="text-xs text-muted">
                {Math.round(berkas.size / 1024)} KB
              </p>
              <div className="mt-2 flex gap-1.5">
                {algoritma.map((a) => (
                  <span
                    key={a}
                    className={`rounded px-2 py-0.5 text-xs font-bold text-surface ${latar[a]}`}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={hapus}
              aria-label={`Hapus berkas ${label}`}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-error/30 bg-surface text-error"
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setSeret(true);
            }}
            onDragLeave={() => setSeret(false)}
            onDrop={(e) => {
              e.preventDefault();
              setSeret(false);
              pilih(e.dataTransfer.files[0]);
            }}
            className={`flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm font-semibold text-brand ${
              galat
                ? "border-error"
                : seret
                  ? "border-brand bg-brand-soft"
                  : "border-border bg-background"
            }`}
          >
            <Upload size={18} aria-hidden="true" />
            Pilih berkas
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            pilih(e.target.files[0]);
            e.target.value = "";
          }}
        />
        {galat && (
          <p role="alert" className="mt-2 text-xs text-error">
            {galat}
          </p>
        )}
      </div>

      {berkas && (
        <div className="flex flex-col gap-3 border-t border-border p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted">
              Unduh dengan:
            </span>
            <div
              role="radiogroup"
              aria-label="Algoritma unduhan"
              className="flex overflow-hidden rounded-lg border border-border"
            >
              {algoritma.map((a) => (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={pilihan === a}
                  onClick={() => setPilihan(a)}
                  className={`h-10 px-4 text-sm font-bold ${
                    pilihan === a ? `${latar[a]} text-surface` : teks[a]
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => console.log("Unduh", label, pilihan)}
              className="h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-surface hover:bg-brand-hover"
            >
              Unduh
            </button>
          </div>
          <button
            type="button"
            onClick={() => console.log("Lihat ciphertext", label, pilihan)}
            className="h-10 w-full rounded-lg border border-border bg-surface text-sm font-semibold text-brand hover:bg-brand-soft"
          >
            Lihat ciphertext
          </button>
        </div>
      )}
    </div>
  );
}
