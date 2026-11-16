import { useState } from "react";
import Button from "../../components/Button";
import {
  BarisKosong,
  BarisPengguna,
  JudulSeksi,
  KartuDaftar,
} from "../../components/berbagi/DaftarPengguna";
import { DialogKonfirmasi } from "../../components/berbagi/Dialog";
import DialogAjukan from "../../components/berbagi/DialogAjukan";
import KerangkaBerbagi from "../../components/berbagi/KerangkaBerbagi";
import Lencana from "../../components/berbagi/Lencana";
import {
  batalkanPermintaan,
  cariPengguna,
  formatTanggal,
  ringkasData,
  useBerbagi,
} from "../../lib/berbagi";

// Keterangan waktu di samping ringkasan data, sesuai status permintaan.
function keteranganWaktu(p) {
  switch (p.status) {
    case "disetujui":
      return `Disetujui ${formatTanggal(p.waktu_disetujui)}`;
    case "aktif":
      return `Berlaku sampai ${formatTanggal(p.berlaku_sampai)}`;
    case "ditolak":
      return `Ditolak ${formatTanggal(p.waktu_ditolak)}`;
    case "berakhir":
      return `Berakhir ${formatTanggal(p.berlaku_sampai)}`;
    default:
      return `Diajukan ${formatTanggal(p.waktu_diajukan)}`;
  }
}

function Aksi({ permintaan: p, onBatal, onAjukanUlang }) {
  switch (p.status) {
    case "disetujui":
      return (
        <>
          <Lencana varian="tindakan">Menunggu kunci dari Anda</Lencana>
          <Button to={`/berbagi/permintaan/${p.id}/kunci`}>Masukkan kunci</Button>
        </>
      );
    case "aktif":
      return (
        <>
          <Lencana varian="sukses">Kunci terpasang</Lencana>
          <Button to={`/berbagi/permintaan/${p.id}/data`}>Lihat data</Button>
        </>
      );
    case "ditolak":
    case "berakhir":
      return (
        <>
          {p.status === "ditolak" ? (
            <Lencana varian="galat">Ditolak</Lencana>
          ) : (
            <Lencana>Berakhir</Lencana>
          )}
          <Button type="button" variant="secondary" onClick={onAjukanUlang}>
            Ajukan ulang
          </Button>
        </>
      );
    default:
      return (
        <>
          <Lencana>Menunggu persetujuan</Lencana>
          <Button type="button" variant="secondary" onClick={onBatal}>
            Batalkan
          </Button>
        </>
      );
  }
}

export default function PermintaanSaya() {
  const { pengguna, keluar } = useBerbagi();
  const [dibatalkan, setDibatalkan] = useState(null);
  const [diajukanUlang, setDiajukanUlang] = useState(null);

  return (
    <KerangkaBerbagi
      judul="Permintaan saya"
      keterangan="Pantau permintaan akses yang Anda ajukan. Setelah pemilik menyetujui, kunci dikirim lewat email atau WhatsApp dan harus dimasukkan di sini."
    >
      <section className="flex flex-col gap-4">
        <JudulSeksi
          judul="Permintaan yang diajukan"
          keterangan={
            keluar.length > 0
              ? `${keluar.length} permintaan.`
              : "Belum ada permintaan."
          }
        />
        <KartuDaftar catatan="Kunci dikirim pemilik lewat email atau WhatsApp dalam bentuk terenkripsi. Kunci hanya dapat dibuka dengan kunci pribadi Anda.">
          {keluar.length === 0 && (
            <BarisKosong>
              <span className="flex flex-col items-center gap-4">
                Anda belum mengajukan permintaan akses. Cari pengguna untuk
                memulai.
                <Button to="/berbagi" variant="secondary">
                  Cari pengguna
                </Button>
              </span>
            </BarisKosong>
          )}
          {keluar.map((p) => {
            const pemilik = cariPengguna(pengguna, p.pemilik);
            return (
              <BarisPengguna
                key={p.id}
                nama={pemilik.nama}
                keterangan={`${ringkasData(p)} · ${keteranganWaktu(p)}`}
              >
                <Aksi
                  permintaan={p}
                  onBatal={() => setDibatalkan({ ...p, nama: pemilik.nama })}
                  onAjukanUlang={() => setDiajukanUlang(pemilik)}
                />
              </BarisPengguna>
            );
          })}
        </KartuDaftar>
      </section>

      {dibatalkan && (
        <DialogKonfirmasi
          judul={`Batalkan permintaan ke ${dibatalkan.nama}?`}
          keterangan="Permintaan dihapus dari kotak masuk pemilik. Anda dapat mengajukannya lagi kapan saja."
          labelSetuju="Batalkan permintaan"
          labelBatal="Kembali"
          onSetuju={() => {
            batalkanPermintaan(dibatalkan.id);
            setDibatalkan(null);
          }}
          onTutup={() => setDibatalkan(null)}
        />
      )}
      {diajukanUlang && (
        <DialogAjukan
          pengguna={diajukanUlang}
          onTutup={() => setDiajukanUlang(null)}
        />
      )}
    </KerangkaBerbagi>
  );
}
