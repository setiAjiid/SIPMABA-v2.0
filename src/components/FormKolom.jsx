import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

const ratakan = (kolom) => kolom.flatMap((k) => k.anak ?? [k]);

export default function FormKolom({ bagian, children }) {
  const semuaKolom = bagian.flatMap((b) => ratakan(b.kolom));
  const [form, setForm] = useState(() =>
    Object.fromEntries(
      semuaKolom.map((k) => [k.nama, k.jenis === "centang" ? [] : ""]),
    ),
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
      const nilai = Array.isArray(form[k.nama])
        ? form[k.nama]
        : form[k.nama].trim();
      if (nilai.length === 0) {
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

  function kontrol(k) {
    const id = `f-${k.nama}`;

    if (k.anak) {
      return (
        <div
          className={`grid gap-3 ${
            k.anak.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
          }`}
        >
          {k.anak.map((a) => (
            <div key={a.nama}>{kontrol(a)}</div>
          ))}
        </div>
      );
    }

    if (k.jenis === "select") {
      return (
        <Select
          id={id}
          placeholder={k.placeholder}
          options={
            typeof k.pilihan === "function" ? k.pilihan(form) : k.pilihan
          }
          disabled={k.bergantung ? !form[k.bergantung] : false}
          value={form[k.nama]}
          onChange={(e) => ubah(k.nama, e.target.value)}
          error={errors[k.nama]}
        />
      );
    }

    if (k.jenis === "radio" || k.jenis === "centang") {
      const radio = k.jenis === "radio";
      return (
        <div
          role={radio ? "radiogroup" : "group"}
          aria-labelledby={`l-${k.nama}`}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 md:min-h-12"
        >
          {k.pilihan.map((p) => (
            <label key={p} className="flex items-center gap-2 text-sm text-ink">
              <input
                type={radio ? "radio" : "checkbox"}
                name={k.nama}
                value={p}
                className="size-4 accent-brand"
                checked={radio ? form[k.nama] === p : form[k.nama].includes(p)}
                onChange={() =>
                  radio
                    ? ubah(k.nama, p)
                    : ubah(
                        k.nama,
                        form[k.nama].includes(p)
                          ? form[k.nama].filter((x) => x !== p)
                          : [...form[k.nama], p],
                      )
                }
              />
              {p}
            </label>
          ))}
          {errors[k.nama] && (
            <p className="basis-full text-xs text-error">{errors[k.nama]}</p>
          )}
        </div>
      );
    }

    if (k.jenis === "area") {
      return (
        <div className="flex flex-col gap-2">
          <textarea
            id={id}
            rows={3}
            placeholder={k.placeholder}
            value={form[k.nama]}
            onChange={(e) => ubah(k.nama, e.target.value)}
            aria-invalid={!!errors[k.nama]}
            className={`w-full resize-none rounded-lg border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
              errors[k.nama] ? "border-error" : "border-border"
            }`}
          />
          {errors[k.nama] && (
            <p className="text-xs text-error">{errors[k.nama]}</p>
          )}
        </div>
      );
    }

    return (
      <Input
        id={id}
        type={k.tipe}
        placeholder={k.placeholder}
        maxLength={k.maks}
        inputMode={k.numerik || k.angka ? "numeric" : undefined}
        disabled={k.bacaSaja}
        hint={
          k.nama === "namaKtm"
            ? `${form[k.nama].length}/${k.maks} karakter`
            : k.petunjuk
        }
        value={form[k.nama]}
        onChange={(e) => ubah(k.nama, e.target.value)}
        error={errors[k.nama]}
      />
    );
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
                    id={`l-${k.nama}`}
                    htmlFor={
                      k.jenis === "radio" || k.jenis === "centang"
                        ? undefined
                        : `f-${k.anak ? k.anak[0].nama : k.nama}`
                    }
                    className="text-sm font-semibold text-ink md:flex md:h-12 md:items-center"
                  >
                    {k.label}
                    {k.opsional && (
                      <span className="ml-1 text-xs font-normal text-muted">
                        (opsional)
                      </span>
                    )}
                  </label>
                  {kontrol(k)}
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
