import { useState } from "react";
import Button from "../components/Button";
import FileDropzone from "../components/FileDropzone";
import SidebarLayout from "../layouts/SidebarLayout";
import {
  ambilCiphertext,
  hapusBerkas,
  unduhBerkas,
  unggahBerkas as kirimBerkas,
  useDaftarBerkas,
} from "../lib/berkas";
import { ambilCiphertextVideo, unduhVideo, unggahVideo } from "../lib/video";
import {
  ambilCiphertextDokumen,
  unduhDokumen,
  unggahDokumen,
} from "../lib/dokumen";
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
const semuaItem = [...daftarUlang, ...unggahBerkas.flatMap((grup) => grup.item)];

export default function Berkas() {
  const [aktif, setAktif] = useState("daftar-ulang");
  const [daftar, muatUlang] = useDaftarBerkas();
  const [tertunda, setTertunda] = useState({});
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState(null);
  const semua = daftar?.berkas ?? [];
  const jumlahTertunda = Object.values(tertunda).reduce((total, files) => total + files.length, 0);

  function pilih(b, files) {
    setTertunda((lama) => ({ ...lama, [b.id]: files }));
    setPesan(null);
  }

  async function simpan() {
    if (menyimpan || jumlahTertunda === 0) return;
    setMenyimpan(true);
    setPesan(null);
    try {
      for (const b of semuaItem) {
        const files = tertunda[b.id] ?? [];
        const { onUnggah } = propsBerkas(b);
        for (const file of files) {
          await onUnggah(file);
          setTertunda((lama) => ({
            ...lama,
            [b.id]: (lama[b.id] ?? []).filter((item) => item !== file),
          }));
        }
      }
      setPesan({ jenis: "sukses", teks: "Berkas berhasil disimpan." });
    } catch (err) {
      setPesan({ jenis: "galat", teks: err.message });
    } finally {
      setMenyimpan(false);
    }
  }

  // Kotak banyak berkas (rapor) memakai kode berakhiran nomor slot,
  // misalnya rapor_sem_1 sampai rapor_sem_7.
  function propsBerkas(b) {
    const banyak = (b.jumlah ?? 1) > 1;
    const terunggah = semua.filter((x) =>
      banyak ? x.kode_berkas.startsWith(b.kode) : x.kode_berkas === b.kode,
    );
    const slotTerpakai = new Set(terunggah.map((x) => x.kode_berkas));
    if (b.video) {
      return {
        terunggah,
        onUnggah: async (file, lapor) => {
          await unggahVideo(file, lapor);
          muatUlang();
        },
        onUnduh: (berkas, algoritma, lapor) =>
          unduhVideo(berkas, algoritma, lapor),
        onCiphertext: ambilCiphertextVideo,
        onHapus: async (berkas) => {
          await hapusBerkas(berkas.id);
          muatUlang();
        },
      };
    } else if (b.dokumen) {
      return {
        terunggah,
        tidakTersedia: b.tidakTersedia,
        onUnggah: async (file, lapor) => {
          const id = await unggahDokumen(file, lapor);

          muatUlang();
          return id;
        },
        onUnduh: (berkas, algoritma, lapor) =>
          unduhDokumen(berkas, algoritma, lapor),
        onCiphertext: ambilCiphertextDokumen,
        onHapus: async (berkas) => {
          await hapusBerkas(berkas.id);
          muatUlang();
        },
      };
    }
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
        }
        await kirimBerkas(kode, file);
        if (banyak) slotTerpakai.add(kode);
        muatUlang();
      },
      onUnduh: (berkas, algoritma) => unduhBerkas(berkas.id, algoritma),
      onCiphertext: (berkas, algoritma) =>
        ambilCiphertext(berkas.id, algoritma),
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
                tertunda={tertunda[b.id] ?? []}
                onPilih={(files) => pilih(b, files)}
                menyimpan={menyimpan}
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
                  tertunda={tertunda[b.id] ?? []}
                  onPilih={(files) => pilih(b, files)}
                  menyimpan={menyimpan}
                />
              ))}
            </section>
          ))}
        <div className="sticky bottom-0 -mx-8 flex items-center justify-end gap-4 border-t border-border bg-surface px-8 py-4">
          {pesan && (
            <p
              role={pesan.jenis === "galat" ? "alert" : "status"}
              className={`text-sm ${pesan.jenis === "galat" ? "text-error" : "text-success"}`}
            >
              {pesan.teks}
            </p>
          )}
          <Button type="button" onClick={simpan} disabled={menyimpan || jumlahTertunda === 0}>
            {menyimpan ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
}
