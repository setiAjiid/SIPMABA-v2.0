import { useEffect, useId, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import InputKataSandi from "../../components/InputKataSandi";
import { JudulSeksi } from "../../components/berbagi/DaftarPengguna";
import FormBuatKunci from "../../components/berbagi/FormBuatKunci";
import KerangkaBerbagi, {
  TidakTersedia,
} from "../../components/berbagi/KerangkaBerbagi";
import {
  cariPengguna,
  pasangKunci,
  siapkanPaketContoh,
  useBerbagi,
} from "../../lib/berbagi";
import {
  GalatKunci,
  ambilPaket,
  bukaKunciPribadi,
  bukaPaket,
} from "../../lib/kunciBerbagi";

const PERMINTAAN = "/berbagi/permintaan";
const UKURAN_BERKAS_MAKS = 16 * 1024;
const LANGKAH = ["Permintaan disetujui", "Kunci diterima", "Data terbuka"];

function Langkah({ aktif }) {
  return (
    <ol className="flex flex-wrap items-center gap-4">
      {LANGKAH.map((label, i) => {
        const selesai = i < aktif;
        const sekarang = i === aktif;
        return (
          <li
            key={label}
            aria-current={sekarang ? "step" : undefined}
            className={`flex items-center gap-4 ${i > 0 ? "flex-1" : ""}`}
          >
            {i > 0 && (
              <span aria-hidden="true" className="h-px min-w-6 flex-1 bg-border" />
            )}
            <span className="flex items-center gap-3">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  selesai
                    ? "bg-success text-surface"
                    : sekarang
                      ? "bg-brand-fill text-on-brand"
                      : "border border-border bg-surface text-muted"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-sm whitespace-nowrap ${
                  sekarang
                    ? "leading-5 font-bold text-ink"
                    : selesai
                      ? "leading-6 text-ink"
                      : "leading-6 text-muted"
                }`}
              >
                {label}
                {selesai && <span className="sr-only"> (selesai)</span>}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function UnggahKunci({ onBerkas }) {
  const inputRef = useRef(null);
  const [seret, setSeret] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setSeret(true);
      }}
      onDragLeave={() => setSeret(false)}
      onDrop={(e) => {
        e.preventDefault();
        setSeret(false);
        onBerkas(e.dataTransfer.files[0]);
      }}
      className={`flex min-h-[146px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-6 text-center transition-colors ${
        seret ? "border-brand bg-brand-soft" : "border-border bg-background"
      }`}
    >
      <Upload className="size-5 text-ink" aria-hidden="true" />
      <p className="text-sm font-bold text-ink">
        Tarik berkas kunci ke sini atau pilih berkas
      </p>
      <Button
        type="button"
        variant="secondary"
        onClick={() => inputRef.current.click()}
      >
        Pilih berkas
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={(e) => {
          onBerkas(e.target.files[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function FormKunci({ permintaan, pemilik }) {
  const navigate = useNavigate();
  const idPaket = useId();
  const { kunci } = useBerbagi();
  const [teks, setTeks] = useState("");
  const [sandi, setSandi] = useState("");
  const [galat, setGalat] = useState({});
  const [info, setInfo] = useState("");
  const [sibuk, setSibuk] = useState(false);

  // Tanpa server berbagi, paket dari pemilik disiapkan di peramban ini.
  useEffect(() => {
    if (kunci) siapkanPaketContoh(permintaan.id).catch(() => {});
  }, [kunci, permintaan.id]);

  function isiPaket(isi, keterangan) {
    setTeks(isi);
    setInfo(keterangan);
    setGalat((g) => ({ ...g, paket: undefined }));
  }

  async function bacaBerkas(berkas) {
    if (!berkas) return;
    setInfo("");
    if (berkas.size > UKURAN_BERKAS_MAKS) {
      setGalat((g) => ({ ...g, paket: "Berkas kunci terlalu besar." }));
      return;
    }
    const paket = ambilPaket(await berkas.text());
    if (!paket) {
      setGalat((g) => ({
        ...g,
        paket: `${berkas.name} tidak berisi paket kunci.`,
      }));
      return;
    }
    isiPaket(paket, `Paket dari ${berkas.name} dimuat.`);
  }

  async function buka(e) {
    e.preventDefault();
    const baru = {};
    if (!teks.trim()) {
      baru.paket = "Tempel paket kunci atau unggah berkasnya terlebih dahulu.";
    }
    if (!sandi) baru.sandi = "Masukkan kata sandi kunci pribadi.";
    setGalat(baru);
    if (Object.keys(baru).length > 0) return;

    setSibuk(true);
    try {
      let pribadi;
      try {
        pribadi = await bukaKunciPribadi(kunci, sandi);
      } catch (err) {
        if (err instanceof GalatKunci) {
          setGalat({ sandi: err.message });
          return;
        }
        throw err;
      }
      // Kunci bersama hanya dipakai untuk memeriksa sidiknya di sini; nanti
      // server memakainya untuk membuka data yang dibagikan.
      const { sidik } = await bukaPaket(teks, pribadi);
      if (permintaan.sidik_kunci && sidik !== permintaan.sidik_kunci) {
        throw new GalatKunci(
          `Paket terbuka, tetapi sidik kuncinya (${sidik}) tidak cocok dengan permintaan ini. Minta ${pemilik.nama} mengirim ulang paket.`,
        );
      }
      pasangKunci(permintaan.id);
      navigate(`${PERMINTAAN}/${permintaan.id}/data`, { replace: true });
    } catch (err) {
      setGalat({
        paket:
          err instanceof GalatKunci
            ? err.message
            : "Kunci tidak dapat dibuka. Coba lagi.",
      });
    } finally {
      setSibuk(false);
    }
  }

  if (!kunci) {
    return (
      <section className="flex flex-col gap-4">
        <JudulSeksi
          judul="Buat pasangan kunci dulu"
          keterangan={`Anda belum punya pasangan kunci. ${pemilik.nama} membutuhkan kunci publik Anda untuk mengenkripsi paket kunci.`}
        />
        <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
          <FormBuatKunci />
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={buka} noValidate className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <JudulSeksi
          judul="Paket kunci"
          keterangan={`Kunci ini hanya berlaku untuk data milik ${pemilik.nama} yang disetujui.`}
        />
        {permintaan.paket_contoh && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-border px-4 py-3">
            <p className="min-w-0 flex-1 text-xs text-muted">
              Mode contoh: server berbagi belum tersambung, jadi paket dari{" "}
              {pemilik.nama} dibuat di peramban ini untuk kunci publik Anda.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                isiPaket(permintaan.paket_contoh, "Paket contoh ditempel.")
              }
            >
              Tempel paket contoh
            </Button>
          </div>
        )}
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
          <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
              <label htmlFor={idPaket} className="text-sm font-semibold text-ink">
                Paket kunci terenkripsi
              </label>
              <textarea
                id={idPaket}
                value={teks}
                onChange={(e) => isiPaket(e.target.value, "")}
                aria-invalid={galat.paket ? true : undefined}
                aria-describedby={`${idPaket}-catatan`}
                placeholder="Tempel paket kunci terenkripsi di sini"
                spellCheck={false}
                className={`h-[120px] w-full resize-y rounded-lg border bg-surface px-4 py-3 font-mono text-xs leading-5 break-all text-ink placeholder:font-sans placeholder:text-sm placeholder:leading-6 placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                  galat.paket ? "border-error" : "border-border"
                }`}
              />
              <p
                id={`${idPaket}-catatan`}
                role={galat.paket ? "alert" : "status"}
                className={`text-xs ${galat.paket ? "text-error" : "text-muted"}`}
              >
                {galat.paket || info}
              </p>
            </div>
            <p className="text-xs text-muted">atau unggah berkas kunci</p>
            <UnggahKunci onBerkas={bacaBerkas} />
            <InputKataSandi
              label="Kata sandi kunci pribadi"
              placeholder="Masukkan kata sandi kunci pribadi"
              autoComplete="off"
              value={sandi}
              onChange={(e) => {
                setSandi(e.target.value);
                setGalat((g) => ({ ...g, sandi: undefined }));
              }}
              error={galat.sandi}
            />
          </div>
          <p className="border-t border-border bg-background px-6 py-4 text-xs text-muted">
            {permintaan.sidik_kunci
              ? `Sidik kunci pengirim: ${permintaan.sidik_kunci}. Cocokkan dengan yang disampaikan ${pemilik.nama} sebelum membuka.`
              : `Cocokkan sidik kunci dengan yang disampaikan ${pemilik.nama} sebelum membuka.`}
          </p>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Button to={PERMINTAAN} variant="secondary">
          Batal
        </Button>
        <Button type="submit" disabled={sibuk}>
          {sibuk ? "Membuka kunci..." : "Buka kunci"}
        </Button>
      </div>
    </form>
  );
}

export default function MasukkanKunci() {
  const { id } = useParams();
  const { pengguna, keluar, kunciDimuat } = useBerbagi();
  const permintaan = keluar.find((p) => p.id === id);
  // Status dibaca sekali saat halaman dibuka, supaya formulir tidak hilang
  // sesaat ketika kunci terpasang tepat sebelum pindah halaman.
  const [disetujui] = useState(permintaan?.status === "disetujui");

  if (!disetujui) {
    return (
      <KerangkaBerbagi
        sapaan="Permintaan saya"
      sapaanKe={PERMINTAAN}
        judul="Kunci tidak dapat dimasukkan"
        tab={false}
      >
        <TidakTersedia
          pesan="Permintaan ini tidak ditemukan, belum disetujui pemilik, atau kuncinya sudah terpasang."
          kembali={PERMINTAAN}
          labelKembali="Kembali ke Permintaan saya"
        />
      </KerangkaBerbagi>
    );
  }

  const pemilik = cariPengguna(pengguna, permintaan.pemilik);
  return (
    <KerangkaBerbagi
      sapaan="Permintaan saya"
      sapaanKe={PERMINTAAN}
      judul={`Masukkan kunci dari ${pemilik.nama}`}
      keterangan={`Tempel paket kunci yang dikirim ${pemilik.nama} lewat email atau WhatsApp, atau unggah berkasnya. Paket dibuka dengan kunci pribadi Anda.`}
      tab={false}
    >
      <Langkah aktif={1} />
      {kunciDimuat && <FormKunci permintaan={permintaan} pemilik={pemilik} />}
    </KerangkaBerbagi>
  );
}
