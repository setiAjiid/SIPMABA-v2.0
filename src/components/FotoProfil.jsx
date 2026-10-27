import { useRef, useState } from "react";
import { User } from "lucide-react";

export default function FotoProfil({ onChange }) {
  const inputRef = useRef(null);
  const [pratinjau, setPratinjau] = useState("");
  const [galat, setGalat] = useState("");

  function pilih(e) {
    const berkas = e.target.files[0];
    e.target.value = "";
    if (!berkas) return;

    if (!["image/jpeg", "image/png"].includes(berkas.type)) {
      setGalat("Format foto harus JPG atau PNG");
      return;
    }
    if (berkas.size > 500 * 1024) {
      setGalat("Ukuran foto maksimal 500 KB");
      return;
    }

    const url = URL.createObjectURL(berkas);
    const gambar = new Image();
    gambar.onload = () => {
      if (gambar.naturalWidth !== 400 || gambar.naturalHeight !== 400) {
        URL.revokeObjectURL(url);
        setGalat("Dimensi foto harus 400×400 px");
        return;
      }
      setPratinjau(url);
      setGalat("");
      onChange?.(berkas);
    };
    gambar.src = url;
  }

  return (
    <div className="grid gap-2 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
      <span className="text-sm font-semibold text-ink">Foto mahasiswa</span>
      <div>
        <div className="flex items-center gap-6 rounded-xl border border-border bg-background p-6">
          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-soft text-brand">
            {pratinjau ? (
              <img
                src={pratinjau}
                alt="Pratinjau foto mahasiswa"
                className="size-full object-cover"
              />
            ) : (
              <User className="size-10" aria-hidden="true" />
            )}
          </div>
          <div className="flex flex-col items-start gap-1">
            <p className="text-sm font-semibold text-ink">Unggah foto formal</p>
            <p className="text-xs text-muted">
              400×400 px, JPG/PNG, maks 500 KB, latar biru, baju formal.
            </p>
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="mt-2 h-9 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Pilih foto
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={pilih}
            />
          </div>
        </div>
        {galat && (
          <p role="alert" className="mt-2 text-xs text-error">
            {galat}
          </p>
        )}
      </div>
    </div>
  );
}
