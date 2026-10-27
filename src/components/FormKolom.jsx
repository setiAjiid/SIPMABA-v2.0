import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

export default function FormKolom({ bagian, children }) {
  const semuaKolom = bagian.flatMap((b) => b.kolom);
  const [form, setForm] = useState(() =>
    Object.fromEntries(semuaKolom.map((k) => [k.nama, ""])),
  );
  const [errors, setErrors] = useState({});

  function ubah(nama, nilai) {
    setForm((lama) => {
      const baru = { ...lama, [nama]: nilai };
      for (const k of semuaKolom) {
        if (k.bergantung === nama) baru[k.nama] = "";
      }
      return baru;
    });
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
    <form onSubmit={simpan} noValidate className="flex flex-col gap-6">
      <div className="divide-y divide-border rounded-xl border border-border bg-surface p-8">
        {bagian.map((b) => (
          <section key={b.judul} className="py-8 first:pt-0 last:pb-0">
            <h2 className="text-xl font-bold text-ink">{b.judul}</h2>
            {b.keterangan && (
              <p className="text-xs font-semibold text-muted">{b.keterangan}</p>
            )}
            <div className="mt-6 flex flex-col gap-6">
              {b.kolom.map((k) => (
                <div
                  key={k.nama}
                  className="grid gap-2 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8"
                >
                  <label
                    htmlFor={`f-${k.nama}`}
                    className="text-sm font-semibold text-ink md:flex md:h-12 md:items-center"
                  >
                    {k.label}
                  </label>
                  {k.jenis === "select" ? (
                    <Select
                      id={`f-${k.nama}`}
                      options={
                        typeof k.pilihan === "function"
                          ? k.pilihan(form)
                          : k.pilihan
                      }
                      disabled={k.bergantung ? !form[k.bergantung] : false}
                      value={form[k.nama]}
                      onChange={(e) => ubah(k.nama, e.target.value)}
                      error={errors[k.nama]}
                    />
                  ) : (
                    <Input
                      id={`f-${k.nama}`}
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
                            : k.petunjuk
                      }
                      value={form[k.nama]}
                      onChange={(e) => ubah(k.nama, e.target.value)}
                      error={errors[k.nama]}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {children}

      <div className="sticky bottom-0 -mx-8 flex justify-end border-t border-border bg-surface px-8 py-4">
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
