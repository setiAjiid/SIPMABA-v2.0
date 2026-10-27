import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";

const bagian = [
  {
    judul: "Identitas",
    kolom: [
      {
        nama: "noPendaftaran",
        label: "Nomor pendaftaran",
        bacaSaja: true,
        placeholder: "Dibuat otomatis oleh sistem",
      },
      { nama: "namaIjazah", label: "Nama sesuai ijazah" },
      { nama: "namaKtm", label: "Nama pada KTM", maks: 20 },
      {
        nama: "nik",
        label: "NIK",
        pola: /^\d{16}$/,
        galat: "NIK harus 16 digit",
        maks: 16,
        numerik: true,
      },
      { nama: "noPaspor", label: "Nomor paspor", opsional: true },
      {
        nama: "jenisKelamin",
        label: "Jenis kelamin",
        jenis: "select",
        pilihan: ["Laki-laki", "Perempuan"],
      },
      {
        nama: "agama",
        label: "Agama",
        jenis: "select",
        pilihan: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"],
      },
      {
        nama: "statusPernikahan",
        label: "Status pernikahan",
        jenis: "select",
        pilihan: ["Belum menikah", "Menikah", "Cerai"],
      },
      { nama: "tanggalLahir", label: "Tanggal lahir", tipe: "date" },
      { nama: "tempatLahir", label: "Tempat lahir (sesuai KTP)" },
    ],
  },
  {
    judul: "Kontak",
    kolom: [
      {
        nama: "email",
        label: "Email",
        tipe: "email",
        pola: /^\S+@\S+\.\S+$/,
        galat: "Format email tidak valid",
      },
      { nama: "noHp", label: "Nomor WhatsApp", tipe: "tel", numerik: true },
      {
        nama: "kodePos",
        label: "Kode pos",
        pola: /^\d{5}$/,
        galat: "Kode pos harus 5 digit",
        maks: 5,
        numerik: true,
      },
    ],
  },
  {
    judul: "Lainnya",
    kolom: [
      {
        nama: "ukuranAlmamater",
        label: "Ukuran almamater",
        jenis: "select",
        pilihan: ["S", "M", "L", "XL", "XXL"],
      },
      { nama: "noKipK", label: "Nomor KIP-K", opsional: true },
      { nama: "noBpjs", label: "Nomor BPJS", opsional: true },
      {
        nama: "sumberInformasi",
        label: "Sumber informasi",
        jenis: "select",
        pilihan: ["Website", "Media sosial", "Teman", "Keluarga", "Sekolah"],
      },
    ],
  },
];

const semuaKolom = bagian.flatMap((b) => b.kolom);
const awal = Object.fromEntries(semuaKolom.map((k) => [k.nama, ""]));

export default function DataDiri() {
  const [form, setForm] = useState(awal);
  const [errors, setErrors] = useState({});

  function ubah(nama, nilai) {
    setForm((lama) => ({ ...lama, [nama]: nilai }));
  }

  function simpan(e) {
    e.preventDefault();
    const baru = {};
    for (const k of semuaKolom) {
      if (k.bacaSaja) continue;
      const nilai = form[k.nama].trim();
      if (!nilai) {
        if (!k.opsional) baru[k.nama] = `${k.label} wajib diisi`;
        continue;
      }
      if (k.pola && !k.pola.test(nilai)) baru[k.nama] = k.galat;
    }
    setErrors(baru);
    if (Object.keys(baru).length === 0) console.log("Siap disimpan", form);
  }

  return (
    <form onSubmit={simpan} noValidate className="flex flex-col gap-8">
      {bagian.map((b) => (
        <section key={b.judul} className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-ink">{b.judul}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {b.kolom.map((k) =>
              k.jenis === "select" ? (
                <Select
                  key={k.nama}
                  label={k.label}
                  options={k.pilihan}
                  value={form[k.nama]}
                  onChange={(e) => ubah(k.nama, e.target.value)}
                  error={errors[k.nama]}
                />
              ) : (
                <Input
                  key={k.nama}
                  label={k.label}
                  type={k.tipe}
                  placeholder={k.placeholder}
                  maxLength={k.maks}
                  inputMode={k.numerik ? "numeric" : undefined}
                  disabled={k.bacaSaja}
                  hint={
                    k.maks && k.nama === "namaKtm"
                      ? `${form[k.nama].length}/${k.maks}`
                      : k.opsional
                        ? "Opsional"
                        : undefined
                  }
                  value={form[k.nama]}
                  onChange={(e) => ubah(k.nama, e.target.value)}
                  error={errors[k.nama]}
                />
              ),
            )}
          </div>
        </section>
      ))}
      <div>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
