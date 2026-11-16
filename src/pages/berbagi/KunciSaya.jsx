import { useState } from "react";
import Button from "../../components/Button";
import { JudulSeksi } from "../../components/berbagi/DaftarPengguna";
import Dialog from "../../components/berbagi/Dialog";
import FormBuatKunci from "../../components/berbagi/FormBuatKunci";
import KerangkaBerbagi from "../../components/berbagi/KerangkaBerbagi";
import Lencana from "../../components/berbagi/Lencana";
import {
  BarisRincian,
  ChipAlgoritma,
  KartuRincian,
  Kode,
} from "../../components/berbagi/Rincian";
import { ambilNama } from "../../lib/api";
import {
  formatTanggal,
  salinTeks,
  unduhTeks,
  useBerbagi,
} from "../../lib/berbagi";
import { ALGORITMA } from "../../lib/berkas";
import { pemPublik } from "../../lib/kunciBerbagi";

function PasanganKunci({ kunci, menungguKunci }) {
  const [info, setInfo] = useState("");
  const [buatUlang, setBuatUlang] = useState(false);

  async function salin() {
    setInfo(
      (await salinTeks(pemPublik(kunci.publik)))
        ? "Kunci publik disalin."
        : "Tidak dapat menyalin otomatis. Izinkan akses papan klip lalu coba lagi.",
    );
  }

  function unduhCadangan() {
    unduhTeks(
      `cadangan-kunci-sipmaba-${ambilNama() ?? "pengguna"}.json`,
      `${JSON.stringify(kunci, null, 2)}\n`,
      "application/json",
    );
    setInfo(
      "Cadangan diunduh. Kunci pribadi di dalamnya tetap terbungkus kata sandi Anda.",
    );
  }

  return (
    <>
      <KartuRincian
        tambahan={
          <div className="flex flex-col gap-3 px-6 py-4">
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={salin}>
                Salin kunci publik
              </Button>
              <Button type="button" variant="secondary" onClick={unduhCadangan}>
                Unduh cadangan kunci pribadi
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setBuatUlang(true)}
              >
                Buat ulang kunci
              </Button>
            </div>
            {info && (
              <p role="status" className="text-xs text-muted">
                {info}
              </p>
            )}
          </div>
        }
      >
        <BarisRincian label="Algoritma" tebal>
          RSA 2048 bit
        </BarisRincian>
        <BarisRincian label="Sidik kunci publik">
          <Kode>{kunci.sidik}</Kode>
        </BarisRincian>
        <BarisRincian label="Dibuat pada">
          {formatTanggal(kunci.dibuat)}
        </BarisRincian>
        <BarisRincian label="Kunci pribadi">
          <Lencana varian="sukses">Tersimpan terenkripsi</Lencana>
        </BarisRincian>
      </KartuRincian>

      {buatUlang && (
        <Dialog
          judul="Buat ulang pasangan kunci?"
          keterangan={`Kunci lama langsung tidak berlaku, dan paket kunci yang dibuat untuknya tidak dapat dibuka lagi.${
            menungguKunci > 0
              ? ` ${menungguKunci} permintaan yang menunggu kunci dari Anda perlu dikirimi paket baru oleh pemiliknya.`
              : ""
          }`}
          onTutup={() => setBuatUlang(false)}
        >
          <FormBuatKunci
            labelTombol="Buat ulang kunci"
            onBatal={() => setBuatUlang(false)}
            onSelesai={() => {
              setBuatUlang(false);
              setInfo("Pasangan kunci baru dibuat.");
            }}
          />
        </Dialog>
      )}
    </>
  );
}

export default function KunciSaya() {
  const { kunci, kunciDimuat, keluar, masuk } = useBerbagi();
  const kunciBersama = masuk.filter((p) => p.status === "aktif").length;
  const menungguKunci = keluar.filter((p) => p.status === "disetujui").length;

  return (
    <KerangkaBerbagi
      judul="Kunci saya"
      keterangan="Pasangan kunci asimetris Anda dipakai untuk menerima kunci bersama dari pengguna lain. Kunci pribadi tidak pernah meninggalkan perangkat Anda dalam bentuk terbuka."
    >
      <section className="flex flex-col gap-4">
        <JudulSeksi
          judul="Pasangan kunci"
          keterangan={
            kunci || !kunciDimuat
              ? "Kunci publik boleh dibagikan. Kunci pribadi hanya Anda yang memegang."
              : "Anda belum punya pasangan kunci. Buat sekarang supaya pemilik data dapat mengirim kunci kepada Anda."
          }
        />
        {kunci && <PasanganKunci kunci={kunci} menungguKunci={menungguKunci} />}
        {kunciDimuat && !kunci && (
          <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
            <FormBuatKunci />
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <JudulSeksi
          judul="Penyimpanan kunci di server"
          keterangan="Kunci disimpan berlapis agar tidak ada kunci yang tersimpan dalam bentuk terbuka."
        />
        <KartuRincian catatan="Isi database tidak dapat dibaca tanpa kunci utama server. Mencabut akses menghapus kunci bersama terkait.">
          <BarisRincian label="Kunci utama server">
            Disimpan terpisah dari database dan membungkus kunci pengguna.
          </BarisRincian>
          <BarisRincian label="Kunci pengguna">
            Satu per pengguna, tersimpan terbungkus kunci utama.
          </BarisRincian>
          <BarisRincian label="Kunci data">
            {ALGORITMA.map((a) => (
              <ChipAlgoritma key={a} algoritma={a} />
            ))}
            Satu set per berkas, terbungkus kunci pengguna.
          </BarisRincian>
          <BarisRincian label="Kunci bersama">
            {kunciBersama} aktif. Tersimpan terbungkus kunci milik pemilik data.
          </BarisRincian>
        </KartuRincian>
      </section>
    </KerangkaBerbagi>
  );
}
