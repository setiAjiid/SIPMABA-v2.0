import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import {
  BarisKosong,
  BarisPengguna,
  JudulSeksi,
  KartuDaftar,
} from "../../components/berbagi/DaftarPengguna";
import KerangkaBerbagi from "../../components/berbagi/KerangkaBerbagi";
import Lencana from "../../components/berbagi/Lencana";
import { formatTanggal, permintaanUntuk, useBerbagi } from "../../lib/berbagi";

const tautanUtama =
  "inline-flex h-10 items-center justify-center rounded-lg border border-brand bg-brand px-4 text-sm font-bold text-surface transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

function Aksi({ permintaan }) {
  if (permintaan?.status === "menunggu") {
    return <Lencana>Menunggu persetujuan</Lencana>;
  }
  if (permintaan?.status === "disetujui") {
    return (
      <>
        <Lencana varian="sukses">Disetujui</Lencana>
        <Link
          to={`/berbagi/permintaan/${permintaan.id}/kunci`}
          className={tautanUtama}
        >
          Masukkan kunci
        </Link>
      </>
    );
  }
  if (permintaan?.status === "aktif") {
    return (
      <>
        <Lencana varian="sukses">Disetujui</Lencana>
        <Link
          to={`/berbagi/permintaan/${permintaan.id}/data`}
          className={tautanUtama}
        >
          Lihat data
        </Link>
      </>
    );
  }
  // Belum pernah meminta, ditolak, atau aksesnya sudah berakhir.
  return (
    <Button type="button" variant="secondary">
      Minta akses
    </Button>
  );
}

export default function CariPengguna() {
  const { pengguna, keluar } = useBerbagi();
  const [isian, setIsian] = useState("");
  const [kataKunci, setKataKunci] = useState("");

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
              <Aksi permintaan={permintaanUntuk(keluar, p.nama_pengguna)} />
            </BarisPengguna>
          ))}
        </KartuDaftar>
      </section>
    </KerangkaBerbagi>
  );
}
