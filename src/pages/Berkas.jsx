import { useState } from "react";
import FileDropzone from "../components/FileDropzone";
import SidebarLayout from "../layouts/SidebarLayout";
import { daftarUlang, unggahBerkas } from "../data/berkas";

const menu = [
  { id: "daftar-ulang", label: "Berkas Daftar Ulang" },
  { id: "unggah", label: "Unggah Berkas" },
];

const teks = {
  "daftar-ulang": {
    judul: "Berkas Daftar Ulang",
    keterangan:
      "Unggah dokumen daftar ulang sesuai ketentuan pada setiap berkas.",
  },
  unggah: {
    judul: "Unggah Berkas",
    keterangan: "Unggah dokumen pendukung kondisi ekonomi dan tempat tinggal.",
  },
};

export default function Berkas() {
  const [aktif, setAktif] = useState("daftar-ulang");

  return (
    <SidebarLayout judul="BERKAS" menu={menu} aktif={aktif} onPilih={setAktif}>
      <div className="mx-auto flex max-w-[876px] flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            {teks[aktif].judul}
          </h1>
          <p className="text-sm text-muted">{teks[aktif].keterangan}</p>
        </div>

        {aktif === "daftar-ulang" && (
          <div className="flex flex-col gap-4">
            {daftarUlang.map((b) => (
              <FileDropzone
                key={b.id}
                label={b.label}
                hint={b.hint}
                optional={b.optional}
                jumlah={b.jumlah}
              />
            ))}
          </div>
        )}

        {aktif === "unggah" &&
          unggahBerkas.map((grup) => (
            <section key={grup.judul} className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-ink">{grup.judul}</h2>
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
            </section>
          ))}
      </div>
    </SidebarLayout>
  );
}
