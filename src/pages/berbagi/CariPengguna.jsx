import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import {
  BarisKosong,
  BarisPengguna,
  JudulSeksi,
  KartuDaftar,
} from "../../components/berbagi/DaftarPengguna";
import DialogAjukan from "../../components/berbagi/DialogAjukan";
import KerangkaBerbagi from "../../components/berbagi/KerangkaBerbagi";
import Lencana from "../../components/berbagi/Lencana";
import { formatTanggal, permintaanUntuk, useBerbagi } from "../../lib/berbagi";

function Aksi({ permintaan, onMinta }) {
  if (permintaan?.status === "menunggu") {
    return <Lencana>Menunggu persetujuan</Lencana>;
  }
  if (permintaan?.status === "disetujui") {
    return (
      <>
        <Lencana varian="sukses">Disetujui</Lencana>
        <Button to={`/berbagi/permintaan/${permintaan.id}/kunci`}>
          Masukkan kunci
        </Button>
      </>
    );
  }
  if (permintaan?.status === "aktif") {
    return (
      <>
        <Lencana varian="sukses">Disetujui</Lencana>
        <Button to={`/berbagi/permintaan/${permintaan.id}/data`}>
          Lihat data
        </Button>
      </>
    );
  }
  // Belum pernah meminta, ditolak, atau aksesnya sudah berakhir.
  return (
    <Button type="button" variant="secondary" onClick={onMinta}>
      Minta akses
    </Button>
  );
}

export default function CariPengguna() {
  const { pengguna, keluar } = useBerbagi();
  const [isian, setIsian] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const [tujuan, setTujuan] = useState(null);
  const [pesan, setPesan] = useState("");

  const kunci = kataKunci.trim().toLowerCase();
  const hasil = pengguna.filter(
    (p) =>
      !kunci ||
      p.nama.toLowerCase().includes(kunci) ||
      p.nama_pengguna.toLowerCase().includes(kunci),
  );

  function cari(e) {
    e.preventDefault();
    setKataKunci(isian);
    setPesan("");
  }

  return (
    <KerangkaBerbagi
      judul="Cari pengguna"
      keterangan="Ajukan permintaan untuk melihat data pribadi pengguna lain. Data baru dapat dibuka setelah pemilik menyetujui dan mengirimkan kunci kepada Anda."
    >
      <form onSubmit={cari} role="search" className="flex items-center gap-3">
        <Input
          type="search"
          aria-label="Cari nama atau nama pengguna"
          placeholder="Cari nama atau nama pengguna"
          value={isian}
          onChange={(e) => setIsian(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Cari</Button>
      </form>

      <section className="flex flex-col gap-4">
        <JudulSeksi
          judul="Hasil pencarian"
          keterangan={
            <span role="status">
              {hasil.length > 0
                ? `${hasil.length} pengguna ditemukan.`
                : "Tidak ada pengguna yang cocok."}
            </span>
          }
        />
        {pesan && (
          <p role="status" className="text-sm text-success">
            {pesan}
          </p>
        )}
        <KartuDaftar catatan="Hanya nama pengguna yang tampil di sini. Data pribadi tidak terlihat sebelum pemilik menyetujui permintaan.">
          {hasil.length === 0 && (
            <BarisKosong>
              Tidak ada pengguna dengan nama “{kataKunci.trim()}”. Periksa ejaan
              atau coba nama pengguna.
            </BarisKosong>
          )}
          {hasil.map((p) => (
            <BarisPengguna
              key={p.nama_pengguna}
              nama={p.nama}
              keterangan={`${p.nama_pengguna} · Bergabung ${formatTanggal(p.bergabung)}`}
            >
              <Aksi
                permintaan={permintaanUntuk(keluar, p.nama_pengguna)}
                onMinta={() => setTujuan(p)}
              />
            </BarisPengguna>
          ))}
        </KartuDaftar>
      </section>

      {tujuan && (
        <DialogAjukan
          pengguna={tujuan}
          onTutup={() => setTujuan(null)}
          onTerkirim={(p) =>
            setPesan(
              `Permintaan terkirim ke ${p.nama}. Pantau statusnya di Permintaan saya.`,
            )
          }
        />
      )}
    </KerangkaBerbagi>
  );
}
