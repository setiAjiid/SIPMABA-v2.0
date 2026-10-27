import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

export default function FormKolom({ bagian }) {
  const semuaKolom = bagian.flatMap((b) => b.kolom);
  const [form, setForm] = useState(() =>
    Object.fromEntries(semuaKolom.map((k) => [k.nama, ""])),
  );
  const [errors, setErrors] = useState({});

  function ubah(nama, nilai) {
    setForm((lama) => ({ ...lama, [nama]: nilai }));
  }

  function simpan(e) {
    e.preventDefault();
    const baru = {};
    for (const k of semuaKolom) {
      if (k.bacaSaja) continue;
      const nilai = form[k.nama].trim();
      if (!nilai) {
        if (!k.opsional) baru[k.nama] = `${k.label} wajib diisi`;
        continue;
      }
      if (k.angka && !/^\d+$/.test(nilai)) {
        baru[k.nama] = `${k.label} harus berupa bilangan bulat tanpa titik`;
      } else if (k.min !== undefined && Number(nilai) < k.min) {
        baru[k.nama] = `${k.label} minimal ${k.min}`;
      } else if (k.pola && !k.pola.test(nilai)) {
        baru[k.nama] = k.galat;
      }
    }
    setErrors(baru);
    if (Object.keys(baru).length === 0) console.log("Siap disimpan", form);
  }

  return (
    <form onSubmit={simpan} noValidate className="flex flex-col gap-8">
      {bagian.map((b) => (
        <section key={b.judul} className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-ink">{b.judul}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {b.kolom.map((k) =>
              k.jenis === "select" ? (
                <Select
                  key={k.nama}
                  label={k.label}
                  options={k.pilihan}
                  value={form[k.nama]}
                  onChange={(e) => ubah(k.nama, e.target.value)}
                  error={errors[k.nama]}
                />
              ) : (
                <Input
                  key={k.nama}
                  label={k.label}
                  type={k.tipe}
                  placeholder={k.placeholder}
                  maxLength={k.maks}
                  inputMode={k.numerik || k.angka ? "numeric" : undefined}
                  disabled={k.bacaSaja}
                  hint={
                    k.maks && k.nama === "namaKtm"
                      ? `${form[k.nama].length}/${k.maks}`
                      : k.opsional
                        ? "Opsional"
                        : undefined
                  }
                  value={form[k.nama]}
                  onChange={(e) => ubah(k.nama, e.target.value)}
                  error={errors[k.nama]}
                />
              ),
            )}
          </div>
        </section>
      ))}
      <div>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
