import { useId, useState } from "react";
import Button from "../Button";
import { KATEGORI_DATA } from "../../data/berbagi";
import { ajukanPermintaan } from "../../lib/berbagi";
import Dialog, { TombolDialog } from "./Dialog";
import KotakCentang from "./KotakCentang";

const BATAS_PESAN = 300;

export default function DialogAjukan({ pengguna, onTutup, onTerkirim }) {
  const idPesan = useId();
  const [data, setData] = useState(["biodata", "berkas_daftar_ulang"]);
  const [pesan, setPesan] = useState("");
  const [galat, setGalat] = useState("");

  function alih(id) {
    setGalat("");
    setData((lama) =>
      lama.includes(id) ? lama.filter((d) => d !== id) : [...lama, id],
    );
  }

  function kirim(e) {
    e.preventDefault();
    if (data.length === 0) {
      setGalat("Pilih minimal satu data yang diminta.");
      return;
    }
    // Urutan mengikuti daftar kategori, bukan urutan klik.
    const terpilih = KATEGORI_DATA.map((k) => k.id).filter((id) =>
      data.includes(id),
    );
    ajukanPermintaan(pengguna.nama_pengguna, terpilih, pesan.trim());
    onTerkirim?.(pengguna);
    onTutup();
  }

  return (
    <Dialog
      judul={`Minta akses data ${pengguna.nama}`}
      keterangan="Pemilik akan meninjau permintaan Anda. Data baru dapat dibuka setelah pemilik mengirim kunci."
      onTutup={onTutup}
    >
      <form onSubmit={kirim} className="flex flex-col gap-5">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm font-semibold text-ink">
            Data yang diminta
          </legend>
          {KATEGORI_DATA.map((k) => (
            <KotakCentang
              key={k.id}
              label={k.label}
              checked={data.includes(k.id)}
              onChange={() => alih(k.id)}
            />
          ))}
          {galat && (
            <p role="alert" className="text-xs text-error">
              {galat}
            </p>
          )}
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor={idPesan} className="text-sm font-semibold text-ink">
            Pesan untuk pemilik (opsional)
          </label>
          <textarea
            id={idPesan}
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            maxLength={BATAS_PESAN}
            placeholder="Tulis alasan permintaan Anda"
            className="h-[88px] w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-6 text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          />
        </div>

        <p className="text-xs text-muted">
          Kunci akan dikirim pemilik lewat email atau WhatsApp dalam bentuk
          terenkripsi.
        </p>

        <TombolDialog>
          <Button type="button" variant="secondary" onClick={onTutup}>
            Batal
          </Button>
          <Button type="submit">Kirim permintaan</Button>
        </TombolDialog>
      </form>
    </Dialog>
  );
}
