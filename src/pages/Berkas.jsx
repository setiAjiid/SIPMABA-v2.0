import { useState } from "react";
import FileDropzone from "../components/FileDropzone";
import SidebarLayout from "../layouts/SidebarLayout";
import {
  hapusBerkas,
  unggahBerkas as kirimBerkas,
  useDaftarBerkas,
} from "../lib/berkas";
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
  const [daftar, muatUlang] = useDaftarBerkas();
  const semua = daftar?.berkas ?? [];

  // Kotak banyak berkas (rapor) memakai kode berakhiran nomor slot,
  // misalnya rapor_sem_1 sampai rapor_sem_7.
  function propsBerkas(b) {
    const banyak = (b.jumlah ?? 1) > 1;
    const terunggah = semua.filter((x) =>
      banyak ? x.kode_berkas.startsWith(b.kode) : x.kode_berkas === b.kode,
    );
    const slotTerpakai = new Set(terunggah.map((x) => x.kode_berkas));
    return {
      terunggah,
      tidakTersedia: b.tidakTersedia,
      onUnggah: async (file) => {
        let kode = b.kode;
        if (banyak) {
          const slot = Array.from({ length: b.jumlah }, (_, i) => i + 1).find(
            (n) => !slotTerpakai.has(`${b.kode}${n}`),
          );
          kode = `${b.kode}${slot}`;
          // Dicatat di sini (bukan di array yang ditampilkan) supaya
          // unggahan berikutnya dalam satu pilihan memakai slot lain.
          slotTerpakai.add(kode);
        }
        await kirimBerkas(kode, file);
        muatUlang();
      },
      onHapus: async (berkas) => {
        await hapusBerkas(berkas.id);
        muatUlang();
      },
    };
  }

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
                {...propsBerkas(b)}
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
                  {...propsBerkas(b)}
                />
              ))}
            </section>
          ))}
      </div>
    </SidebarLayout>
  );
}
