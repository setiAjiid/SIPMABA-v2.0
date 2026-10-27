import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { ALGORITMA, formatUkuran } from "../lib/berkas";

const latar = {
  AES: "bg-algorithm-aes",
  DES: "bg-algorithm-des",
  RC4: "bg-algorithm-rc4",
};

// terunggah: berkas milik kotak ini yang sudah tersimpan di server.
// File yang dipilih menunggu tombol Simpan di halaman Berkas.
// onUnduh(berkas, algoritma, lapor) opsional, menampilkan
// tombol unduh dengan pilihan algoritma. onCiphertext(berkas, algoritma)
// opsional, mengembalikan ciphertext base64 untuk ditampilkan, atau
// { isi, keterangan } untuk berkas yang disimpan per potongan.
export default function FileDropzone({
  label,
  hint,
  optional = false,
  accept = ["image/jpeg", "image/png"],
  minKB = 0,
  maxKB = 500,
  jumlah = 1,
  terunggah = [],
  tertunda = [],
  onPilih,
  onHapus,
  onUnduh,
  onCiphertext,
  tidakTersedia,
  menyimpan = false,
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [sibuk, setSibuk] = useState(false);
  const [progres, setProgres] = useState("");
  const [algoritma, setAlgoritma] = useState("AES");
  const [ciphertext, setCiphertext] = useState(null);
  const banyak = jumlah > 1;

  async function pilih(daftar) {
    const baru = Array.from(daftar ?? []);
    if (baru.length === 0 || sibuk || menyimpan || tidakTersedia) return;
    const tujuan = banyak ? [...tertunda, ...baru] : baru.slice(0, 1);

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
    if (
      banyak &&
      tujuan.some((f, i) =>
        tujuan.slice(0, i).some((lain) => lain.name === f.name && lain.size === f.size),
      )
    ) {
      setError("Berkas yang sama sudah dipilih");
      return;
    }
    if (banyak && terunggah.length + tujuan.length > jumlah) {
      setError(`Maksimal ${jumlah} berkas`);
      return;
    }

    setError("");
    onPilih?.(tujuan);
  }

  async function jalankan(aksi) {
    if (menyimpan) return;
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
                ? progres || "Memproses berkas..."
                : !banyak && terunggah[0]
                  ? "Pilih berkas lain untuk mengganti"
                  : "Tarik berkas ke sini atau pilih berkas"}
            </p>
            <button
              type="button"
              disabled={sibuk || menyimpan}
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
        {tertunda.length > 0 && (
          <ul className="flex flex-col gap-1">
            {tertunda.map((f) => (
              <li key={`${f.name}-${f.size}-${f.lastModified}`} className="flex items-center gap-2 text-xs text-ink">
                <span className="min-w-0 flex-1 truncate">
                  {f.name} ({formatUkuran(f.size)}) · belum disimpan
                </span>
                <button
                  type="button"
                  disabled={menyimpan}
                  onClick={() => onPilih?.(tertunda.filter((item) => item !== f))}
                  aria-label={`Batalkan ${f.name}`}
                  className="text-error disabled:opacity-60"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
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
                      disabled={sibuk || menyimpan}
                      onClick={() =>
                        jalankan(() => onUnduh(b, algoritma, setProgres))
                      }
                      className="h-7 rounded bg-brand px-2 font-semibold text-surface disabled:opacity-60"
                    >
                      Unduh
                    </button>
                    {onCiphertext && (
                      <button
                        type="button"
                        disabled={sibuk || menyimpan}
                        onClick={() =>
                          ciphertext?.id === b.id &&
                          ciphertext.algoritma === algoritma
                            ? setCiphertext(null)
                            : jalankan(async () => {
                                const hasil = await onCiphertext(b, algoritma);
                                setCiphertext({
                                  id: b.id,
                                  algoritma,
                                  isi: hasil.isi ?? hasil,
                                  keterangan: hasil.keterangan,
                                });
                              })
                        }
                        className="h-7 rounded border border-border px-2 font-semibold text-brand disabled:opacity-60"
                      >
                        Ciphertext
                      </button>
                    )}
                  </span>
                )}
                <button
                  type="button"
                  disabled={sibuk || menyimpan}
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
        {ciphertext && terunggah.some((b) => b.id === ciphertext.id) && (
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted">
              Ciphertext {ciphertext.algoritma} (base64,{" "}
              {ciphertext.isi.length.toLocaleString("id-ID")} karakter
              {ciphertext.keterangan && `, ${ciphertext.keterangan}`})
            </p>
            <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-background p-3 font-mono text-[11px] leading-4 text-ink">
              {ciphertext.isi.slice(0, 600)}
              {ciphertext.isi.length > 600 && "…"}
            </pre>
          </div>
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
