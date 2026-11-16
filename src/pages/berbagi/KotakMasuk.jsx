import { useState } from "react";
import Button from "../../components/Button";
import {
  BarisKosong,
  BarisPengguna,
  JudulSeksi,
  KartuDaftar,
} from "../../components/berbagi/DaftarPengguna";
import { DialogKonfirmasi } from "../../components/berbagi/Dialog";
import KerangkaBerbagi from "../../components/berbagi/KerangkaBerbagi";
import Lencana from "../../components/berbagi/Lencana";
import {
  cabutAkses,
  cariPengguna,
  formatTanggal,
  ringkasData,
  tolakPermintaan,
  useBerbagi,
  waktuRelatif,
} from "../../lib/berbagi";

export default function KotakMasuk() {
  const { pengguna, masuk } = useBerbagi();
  // { jenis: "tolak" | "cabut", permintaan, nama }
  const [konfirmasi, setKonfirmasi] = useState(null);

  const nama = (p) => cariPengguna(pengguna, p.peminta).nama;
  const menunggu = masuk.filter((p) => p.status === "menunggu");
  const aktif = masuk.filter((p) => p.status === "aktif");

  function tanya(jenis, permintaan) {
    setKonfirmasi({ jenis, permintaan, nama: nama(permintaan) });
  }

  function jalankan() {
    if (konfirmasi.jenis === "tolak") tolakPermintaan(konfirmasi.permintaan.id);
    else cabutAkses(konfirmasi.permintaan.id);
    setKonfirmasi(null);
  }

  return (
    <KerangkaBerbagi
      judul="Kotak masuk"
      keterangan="Tinjau permintaan dari pengguna lain. Anda memutuskan data apa yang dibagikan, berapa lama, dan kepada siapa."
    >
      <section className="flex flex-col gap-4">
        <JudulSeksi
          judul="Menunggu persetujuan"
          keterangan={
            menunggu.length > 0
              ? `${menunggu.length} permintaan perlu ditanggapi.`
              : "Tidak ada permintaan yang perlu ditanggapi."
          }
        />
        <KartuDaftar>
          {menunggu.length === 0 && (
            <BarisKosong>
              Permintaan baru dari pengguna lain akan muncul di sini.
            </BarisKosong>
          )}
          {menunggu.map((p) => (
            <BarisPengguna
              key={p.id}
              nama={nama(p)}
              keterangan={`Meminta ${ringkasData(p).toLowerCase()} · ${waktuRelatif(p.waktu_diajukan)}`}
            >
              <Button
                type="button"
                variant="secondary"
                onClick={() => tanya("tolak", p)}
              >
                Tolak
              </Button>
              <Button to={`/berbagi/kotak-masuk/${p.id}/setujui`}>
                Tinjau dan setujui
              </Button>
            </BarisPengguna>
          ))}
        </KartuDaftar>
      </section>

      <section className="flex flex-col gap-4">
        <JudulSeksi
          judul="Akses yang sudah diberikan"
          keterangan="Anda dapat mencabut akses kapan saja."
        />
        <KartuDaftar catatan="Mencabut akses menghapus kunci bersama yang tersimpan di server. Kunci yang sudah dikirim tidak dapat dipakai lagi.">
          {aktif.length === 0 && (
            <BarisKosong>Belum ada akses yang Anda berikan.</BarisKosong>
          )}
          {aktif.map((p) => (
            <BarisPengguna
              key={p.id}
              nama={nama(p)}
              keterangan={`${ringkasData(p)} · Berlaku sampai ${formatTanggal(p.berlaku_sampai)}`}
            >
              <Lencana varian="sukses">Aktif</Lencana>
              <Button
                type="button"
                variant="secondary"
                onClick={() => tanya("cabut", p)}
              >
                Cabut akses
              </Button>
            </BarisPengguna>
          ))}
        </KartuDaftar>
      </section>

      {konfirmasi?.jenis === "tolak" && (
        <DialogKonfirmasi
          judul={`Tolak permintaan ${konfirmasi.nama}?`}
          keterangan={`${konfirmasi.nama} akan melihat permintaannya ditolak dan tidak menerima data apa pun. Mereka masih dapat mengajukan permintaan baru.`}
          labelSetuju="Tolak permintaan"
          onSetuju={jalankan}
          onTutup={() => setKonfirmasi(null)}
        />
      )}
      {konfirmasi?.jenis === "cabut" && (
        <DialogKonfirmasi
          judul={`Cabut akses ${konfirmasi.nama}?`}
          keterangan={`Kunci bersama untuk ${konfirmasi.nama} dihapus dari server, sehingga data Anda langsung tidak dapat dibuka lagi. Tindakan ini tidak dapat dibatalkan.`}
          labelSetuju="Cabut akses"
          onSetuju={jalankan}
          onTutup={() => setKonfirmasi(null)}
        />
      )}
    </KerangkaBerbagi>
  );
}
