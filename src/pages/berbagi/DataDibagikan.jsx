import { useState } from "react";
import { File } from "lucide-react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import { JudulSeksi } from "../../components/berbagi/DaftarPengguna";
import KerangkaBerbagi, {
  TidakTersedia,
} from "../../components/berbagi/KerangkaBerbagi";
import Lencana from "../../components/berbagi/Lencana";
import { BarisRincian, KartuRincian } from "../../components/berbagi/Rincian";
import { dataContoh } from "../../data/berbagi";
import {
  aksesBerlaku,
  ambilBerkasDibagikan,
  cariPengguna,
  formatTanggal,
  useBerbagi,
} from "../../lib/berbagi";

const PERMINTAAN = "/berbagi/permintaan";

export default function DataDibagikan() {
  const { id } = useParams();
  const { pengguna, keluar } = useBerbagi();
  const [galat, setGalat] = useState("");
  const permintaan = keluar.find((p) => p.id === id);

  if (!aksesBerlaku(permintaan)) {
    return (
      <KerangkaBerbagi
        sapaan="Permintaan saya"
        sapaanKe={PERMINTAAN}
        judul="Data tidak dapat dibuka"
        tab={false}
      >
        <TidakTersedia
          pesan={
            permintaan?.status === "disetujui"
              ? "Permintaan ini sudah disetujui, tetapi kuncinya belum Anda masukkan."
              : "Akses ke data ini tidak ditemukan, belum disetujui, atau masa berlakunya sudah berakhir."
          }
          kembali={
            permintaan?.status === "disetujui"
              ? `${PERMINTAAN}/${permintaan.id}/kunci`
              : PERMINTAAN
          }
          labelKembali={
            permintaan?.status === "disetujui"
              ? "Masukkan kunci"
              : "Kembali ke Permintaan saya"
          }
        />
      </KerangkaBerbagi>
    );
  }

  const pemilik = cariPengguna(pengguna, permintaan.pemilik);
  const { biodata, berkas } = dataContoh(pemilik, permintaan.data);

  async function buka(namaBerkas) {
    setGalat("");
    try {
      await ambilBerkasDibagikan(permintaan.id, namaBerkas);
    } catch (err) {
      setGalat(err.message);
    }
  }

  return (
    <KerangkaBerbagi
      sapaan="Permintaan saya"
      sapaanKe={PERMINTAAN}
      judul={`Data pribadi ${pemilik.nama}`}
      keterangan={`Data ini dibuka dengan kunci bersama dari ${pemilik.nama}. Anda hanya dapat melihatnya selama akses berlaku.`}
      tab={false}
    >
      <div className="flex flex-wrap items-center gap-4">
        <Lencana>Hanya baca</Lencana>
        <p className="text-xs text-muted">
          Berlaku sampai {formatTanggal(permintaan.berlaku_sampai)}
        </p>
      </div>

      {biodata.length > 0 && (
        <section className="flex flex-col gap-4">
          <JudulSeksi
            judul="Biodata"
            keterangan="Ringkasan dari bagian biodata yang dibagikan."
          />
          <KartuRincian>
            {biodata.map((b) => (
              <BarisRincian key={b.label} label={b.label} tebal>
                {b.nilai}
              </BarisRincian>
            ))}
          </KartuRincian>
        </section>
      )}

      {berkas.length > 0 && (
        <section className="flex flex-col gap-4">
          <JudulSeksi
            judul="Berkas"
            keterangan={`${berkas.length} berkas dibagikan.`}
          />
          {galat && (
            <p role="alert" className="text-sm text-error">
              {galat}
            </p>
          )}
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <ul className="divide-y divide-border">
              {berkas.map((b) => (
                <li
                  key={b.nama}
                  className="flex flex-wrap items-center gap-4 px-6 py-4"
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-ink">
                    <File className="size-6" aria-hidden="true" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="truncate text-sm leading-5 font-bold text-ink">
                      {b.nama}
                    </p>
                    <p className="truncate text-xs text-muted">{b.rincian}</p>
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      aria-label={`Lihat ${b.nama}`}
                      onClick={() => buka(b.nama)}
                    >
                      Lihat
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      aria-label={`Unduh ${b.nama}`}
                      onClick={() => buka(b.nama)}
                    >
                      Unduh
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="border-t border-border bg-background px-6 py-4 text-xs text-muted">
              Berkas didekripsi saat dibuka dan hanya dapat diakses selama masa
              berlaku. Jangan menyebarkannya tanpa izin pemilik.
            </p>
          </div>
        </section>
      )}
    </KerangkaBerbagi>
  );
}
