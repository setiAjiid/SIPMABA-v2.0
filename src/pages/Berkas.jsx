import { useState } from "react";
import FileDropzone from "../components/FileDropzone";
import { daftarUlang, unggahBerkas } from "../data/berkas";

const tabBase = "rounded-md px-4 py-2 text-sm font-bold";
const tabAktif = "bg-surface text-brand shadow-card";
const tabTidakAktif = "text-muted";

export default function Berkas() {
  const [tab, setTab] = useState("daftar-ulang");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-fit gap-1 rounded-lg bg-brand-soft p-1">
        <button
          type="button"
          onClick={() => setTab("daftar-ulang")}
          className={`${tabBase} ${tab === "daftar-ulang" ? tabAktif : tabTidakAktif}`}
        >
          Berkas Daftar Ulang
        </button>
        <button
          type="button"
          onClick={() => setTab("unggah")}
          className={`${tabBase} ${tab === "unggah" ? tabAktif : tabTidakAktif}`}
        >
          Unggah Berkas
        </button>
      </div>

      {tab === "daftar-ulang" && (
        <div className="grid gap-6 md:grid-cols-2">
          {daftarUlang.map((b) => (
            <FileDropzone
              key={b.id}
              label={b.label}
              hint={b.hint}
              optional={b.optional}
            />
          ))}
        </div>
      )}

      {tab === "unggah" &&
        unggahBerkas.map((grup) => (
          <section key={grup.judul} className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-ink">{grup.judul}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {grup.item.map((b) => (
                <FileDropzone
                  key={b.id}
                  label={b.label}
                  hint={b.hint}
                  optional={b.optional}
                  accept={b.accept}
                  minKB={b.minKB}
                  maxKB={b.maxKB}
                />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
