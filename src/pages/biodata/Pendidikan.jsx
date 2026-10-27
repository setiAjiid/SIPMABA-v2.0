import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { wilayah } from "../../data/wilayah";

const awal = {
  provinsi: "",
  kota: "",
  sekolah: "",
  jurusan: "",
  nisn: "",
  masuk: "",
  lulus: "",
};

export default function Pendidikan() {
  const [form, setForm] = useState(awal);
  const [errors, setErrors] = useState({});

  function ubah(nama, nilai) {
    setForm((lama) => ({ ...lama, [nama]: nilai }));
  }

  function simpan(e) {
    e.preventDefault();
    const baru = {};
    if (!form.provinsi) baru.provinsi = "Provinsi wajib dipilih";
    if (!form.kota) baru.kota = "Kota wajib dipilih";
    if (!form.sekolah.trim()) baru.sekolah = "Nama sekolah wajib diisi";
    if (!form.jurusan.trim()) baru.jurusan = "Jurusan wajib diisi";
    if (!/^\d{10}$/.test(form.nisn)) baru.nisn = "NISN harus 10 digit angka";
    if (!/^\d{4}$/.test(form.masuk)) baru.masuk = "Tahun harus 4 digit";
    if (!/^\d{4}$/.test(form.lulus)) baru.lulus = "Tahun harus 4 digit";
    else if (form.masuk && Number(form.lulus) < Number(form.masuk))
      baru.lulus = "Tahun lulus tidak boleh lebih kecil dari tahun masuk";
    setErrors(baru);
    if (Object.keys(baru).length === 0) console.log("Siap disimpan", form);
  }

  return (
    <form onSubmit={simpan} noValidate className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Provinsi sekolah"
          options={Object.keys(wilayah)}
          value={form.provinsi}
          onChange={(e) =>
            setForm({ ...form, provinsi: e.target.value, kota: "" })
          }
          error={errors.provinsi}
        />
        <Select
          label="Kota sekolah"
          options={wilayah[form.provinsi] ?? []}
          value={form.kota}
          onChange={(e) => ubah("kota", e.target.value)}
          disabled={!form.provinsi}
          error={errors.kota}
        />
        <Input
          label="Nama sekolah"
          value={form.sekolah}
          onChange={(e) => ubah("sekolah", e.target.value)}
          error={errors.sekolah}
        />
        <Input
          label="Jurusan"
          placeholder="Contoh: MIPA"
          value={form.jurusan}
          onChange={(e) => ubah("jurusan", e.target.value)}
          error={errors.jurusan}
        />
        <Input
          label="NISN"
          hint="10 digit angka"
          maxLength={10}
          inputMode="numeric"
          value={form.nisn}
          onChange={(e) => ubah("nisn", e.target.value)}
          error={errors.nisn}
        />
        <div />
        <Input
          label="Tahun masuk SMTA"
          maxLength={4}
          inputMode="numeric"
          value={form.masuk}
          onChange={(e) => ubah("masuk", e.target.value)}
          error={errors.masuk}
        />
        <Input
          label="Tahun lulus SMTA"
          maxLength={4}
          inputMode="numeric"
          value={form.lulus}
          onChange={(e) => ubah("lulus", e.target.value)}
          error={errors.lulus}
        />
      </div>
      <div>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
