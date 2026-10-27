import { Fragment, useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import { panggil } from "../lib/api";
import {
  ID_KOSONG,
  dariBackend,
  keBackend,
  labelPilihan,
  nilaiPilihan,
  ratakan,
} from "../lib/biodata";

// tab dan kunci opsional: tanpa keduanya form hanya memvalidasi.
export default function FormKolom({
  bagian,
  tab,
  kunci = {},
  onTersimpan,
  children,
}) {
  const semuaKolom = bagian.flatMap((b) => ratakan(b.kolom ?? []));
  const [form, setForm] = useState(() =>
    Object.fromEntries(
      semuaKolom.map((k) => [k.nama, k.jenis === "centang" ? [] : ""]),
    ),
  );
  const [errors, setErrors] = useState({});
  const [memuat, setMemuat] = useState(Boolean(tab));
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState(null);

  useEffect(() => {
    if (!tab) return;
    let batal = false;
    const kolom = bagian.flatMap((b) => ratakan(b.kolom ?? []));
    panggil(`/biodata/${tab}`)
      .then((res) => {
        if (batal || !res?.data || res.data.id === ID_KOSONG) return;
        setForm((lama) => ({ ...lama, ...dariBackend(kolom, kunci, res.data) }));
      })
      .catch((err) => {
        // 404 berarti pengguna baru, form dibiarkan kosong.
        if (!batal && err.status !== 404)
          setPesan({ jenis: "galat", teks: err.message });
      })
      .finally(() => {
        if (!batal) setMemuat(false);
      });
    return () => {
      batal = true;
    };
  }, [tab, bagian, kunci]);

  function ubah(nama, nilai) {
    setForm((lama) => {
      const baru = { ...lama, [nama]: nilai };
      for (const k of semuaKolom) {
        if (k.bergantung === nama) baru[k.nama] = "";
      }
      return baru;
    });
  }

  async function simpan(e) {
    e.preventDefault();
    setPesan(null);
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
    if (Object.keys(baru).length > 0 || !tab) return;

    setMenyimpan(true);
    try {
      await panggil(`/biodata/${tab}`, {
        method: "PUT",
        body: keBackend(semuaKolom, kunci, form),
      });
      setPesan({ jenis: "sukses", teks: "Data tersimpan." });
      onTersimpan?.();
    } catch (err) {
      setPesan({
        jenis: "galat",
        teks: err.rinci ? `${err.message}: ${err.rinci}` : err.message,
      });
    } finally {
      setMenyimpan(false);
    }
  }

  function kontrol(k) {
    const id = `f-${k.nama}`;

    if (k.anak) {
      return (
        <div
          className={`grid items-start gap-3 ${
            k.pemisah
              ? "md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
              : k.anak.length === 3
                ? "md:grid-cols-3"
                : "md:grid-cols-2"
          }`}
        >
          {k.anak.map((a, i) => (
            <Fragment key={a.nama}>
              {k.pemisah && i === 1 && (
                <span
                  aria-hidden="true"
                  className="hidden h-12 items-center text-sm text-ink md:flex"
                >
                  {k.pemisah}
                </span>
              )}
              <div>{kontrol(a)}</div>
            </Fragment>
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
          {k.pilihan.map((p) => {
            const nilai = nilaiPilihan(p);
            return (
              <label
                key={nilai}
                className="flex items-center gap-2 text-sm text-ink"
              >
                <input
                  type={radio ? "radio" : "checkbox"}
                  name={k.nama}
                  value={nilai}
                  className="size-4 accent-brand"
                  checked={
                    radio
                      ? form[k.nama] === nilai
                      : form[k.nama].includes(nilai)
                  }
                  onChange={() =>
                    radio
                      ? ubah(k.nama, nilai)
                      : ubah(
                          k.nama,
                          form[k.nama].includes(nilai)
                            ? form[k.nama].filter((x) => x !== nilai)
                            : [...form[k.nama], nilai],
                        )
                  }
                />
                {labelPilihan(p)}
              </label>
            );
          })}
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
        satuan={k.satuan}
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

  if (memuat) {
    return <p className="text-sm text-muted">Memuat data...</p>;
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
              {b.kustom}
              {(b.kolom ?? []).map((k) => (
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

      <div className="sticky bottom-0 -mx-8 flex items-center justify-end gap-4 border-t border-border bg-surface px-8 py-4">
        {pesan && (
          <p
            role={pesan.jenis === "galat" ? "alert" : "status"}
            className={`text-sm ${
              pesan.jenis === "galat" ? "text-error" : "text-success"
            }`}
          >
            {pesan.teks}
          </p>
        )}
        <Button type="submit" disabled={menyimpan}>
          {menyimpan ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
