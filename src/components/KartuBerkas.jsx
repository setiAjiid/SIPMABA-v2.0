import { useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import {
  ALGORITMA,
  ambilCiphertext,
  formatUkuran,
  unduhBerkas,
} from "../lib/berkas";

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
// Ciphertext bisa ratusan KB; cukup tampilkan awalnya.
const PANJANG_PRATINJAU = 600;

// berkas: data berkas dari server (atau null). onUnggah dan onHapus
// boleh melempar galat; pesannya ditampilkan di kartu.
export default function KartuBerkas({
  label,
  wajib = false,
  berkas,
  onUnggah,
  onHapus,
}) {
  const inputRef = useRef(null);
  const [galat, setGalat] = useState("");
  const [seret, setSeret] = useState(false);
  const [sibuk, setSibuk] = useState(false);
  const [pilihan, setPilihan] = useState("AES");
  const [ciphertext, setCiphertext] = useState(null);

  async function jalankan(aksi) {
    setSibuk(true);
    setGalat("");
    try {
      await aksi();
    } catch (err) {
      setGalat(err.message);
    } finally {
      setSibuk(false);
    }
  }

  function pilih(f) {
    if (!f || sibuk) return;
    if (!["image/jpeg", "image/png"].includes(f.type)) {
      setGalat("Format berkas harus JPG atau PNG");
      return;
    }
    if (f.size > 500 * 1024) {
      setGalat("Ukuran berkas maksimal 500 KB");
      return;
    }
    setCiphertext(null);
    jalankan(() => onUnggah?.(f));
  }

  function lihatCiphertext() {
    if (ciphertext?.algoritma === pilihan) {
      setCiphertext(null);
      return;
    }
    jalankan(async () => {
      const isi = await ambilCiphertext(berkas.id, pilihan);
      setCiphertext({ algoritma: pilihan, isi });
    });
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
                {berkas.nama_asli}
              </p>
              <p className="text-xs text-muted">
                {formatUkuran(berkas.ukuran_byte)}, terenkripsi
              </p>
              <div className="mt-2 flex gap-1.5">
                {ALGORITMA.map((a) => (
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
              disabled={sibuk}
              onClick={() => {
                setCiphertext(null);
                jalankan(() => onHapus?.(berkas));
              }}
              aria-label={`Hapus berkas ${label}`}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-error/30 bg-surface text-error disabled:opacity-60"
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={sibuk}
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
            {sibuk ? "Mengenkripsi dan menyimpan..." : "Pilih berkas"}
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
              {ALGORITMA.map((a) => (
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
              disabled={sibuk}
              onClick={() => jalankan(() => unduhBerkas(berkas.id, pilihan))}
              className="h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-surface hover:bg-brand-hover disabled:opacity-60"
            >
              Unduh
            </button>
          </div>
          <button
            type="button"
            disabled={sibuk}
            onClick={lihatCiphertext}
            className="h-10 w-full rounded-lg border border-border bg-surface text-sm font-semibold text-brand hover:bg-brand-soft disabled:opacity-60"
          >
            {ciphertext?.algoritma === pilihan
              ? "Tutup ciphertext"
              : `Lihat ciphertext ${pilihan}`}
          </button>
          {ciphertext && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted">
                Ciphertext {ciphertext.algoritma} (base64,{" "}
                {ciphertext.isi.length.toLocaleString("id-ID")} karakter)
              </p>
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-background p-3 font-mono text-[11px] leading-4 text-ink">
                {ciphertext.isi.slice(0, PANJANG_PRATINJAU)}
                {ciphertext.isi.length > PANJANG_PRATINJAU && "…"}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
