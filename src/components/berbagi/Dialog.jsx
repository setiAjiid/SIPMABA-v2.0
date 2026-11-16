import { useEffect, useId, useRef } from "react";
import Button from "../Button";

// Dialog modal di atas elemen <dialog> bawaan: fokus terkunci di dalamnya,
// Esc dan klik di luar kotak menutup dialog.
export default function Dialog({ judul, keterangan, onTutup, children }) {
  const ref = useRef(null);
  const idJudul = useId();
  const idKeterangan = useId();

  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idJudul}
      aria-describedby={keterangan ? idKeterangan : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onTutup();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onTutup();
      }}
      className="m-auto w-[520px] max-w-[calc(100vw-2rem)] rounded-2xl bg-surface shadow-[0_24px_48px_-12px_rgb(20_33_61/0.25)] backdrop:bg-ink/40"
    >
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-2">
          <h2 id={idJudul} className="text-lg leading-6 font-extrabold text-ink">
            {judul}
          </h2>
          {keterangan && (
            <p id={idKeterangan} className="text-sm leading-6 text-muted">
              {keterangan}
            </p>
          )}
        </div>
        {children}
      </div>
    </dialog>
  );
}

export function TombolDialog({ children }) {
  return <div className="flex flex-wrap justify-end gap-3">{children}</div>;
}

export function DialogKonfirmasi({
  judul,
  keterangan,
  labelSetuju,
  labelBatal = "Batal",
  onSetuju,
  onTutup,
}) {
  return (
    <Dialog judul={judul} keterangan={keterangan} onTutup={onTutup}>
      <TombolDialog>
        <Button type="button" variant="secondary" onClick={onTutup}>
          {labelBatal}
        </Button>
        <Button type="button" onClick={onSetuju}>
          {labelSetuju}
        </Button>
      </TombolDialog>
    </Dialog>
  );
}
