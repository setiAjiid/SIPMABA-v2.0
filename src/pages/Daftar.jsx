import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import InputKataSandi from "../components/InputKataSandi";
import AuthLayout from "../layouts/AuthLayout";
import { panggil } from "../lib/api";

export default function Daftar() {
  const [namaPengguna, setNamaPengguna] = useState("");
  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [errors, setErrors] = useState({});
  const [galat, setGalat] = useState("");
  const [memuat, setMemuat] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const baru = {};
    const nama = namaPengguna.trim();
    if (!nama) baru.namaPengguna = "Nama pengguna wajib diisi";
    else if (nama.length < 3 || nama.length > 50)
      baru.namaPengguna = "Nama pengguna 3 sampai 50 karakter";
    if (!/^\S+@\S+\.\S+$/.test(email)) baru.email = "Format email tidak valid";
    if (kataSandi.length < 8) baru.kataSandi = "Kata sandi minimal 8 karakter";
    if (konfirmasi !== kataSandi)
      baru.konfirmasi = "Konfirmasi tidak sama dengan kata sandi";
    setErrors(baru);
    if (Object.keys(baru).length > 0) return;

    setGalat("");
    setMemuat(true);
    try {
      await panggil("/auth/daftar", {
        method: "POST",
        body: {
          nama_pengguna: nama,
          email: email.trim(),
          kata_sandi: kataSandi,
          konfirmasi_kata_sandi: konfirmasi,
        },
      });
      navigate("/masuk", {
        state: { pesan: "Akun berhasil dibuat. Silakan masuk." },
      });
    } catch (err) {
      setGalat(err.message);
      setMemuat(false);
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-ink">Buat akun baru</h2>
          <p className="text-sm text-muted">
            Daftarkan akun untuk memulai proses penerimaan mahasiswa baru.
          </p>
        </div>

        {galat && (
          <p
            role="alert"
            className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
          >
            {galat}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <Input
              label="Nama pengguna"
              placeholder="Masukkan nama pengguna"
              value={namaPengguna}
              onChange={(e) => setNamaPengguna(e.target.value)}
              error={errors.namaPengguna}
            />
            <Input
              label="Email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <InputKataSandi
              label="Kata sandi"
              placeholder="Masukkan kata sandi"
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
              error={errors.kataSandi}
            />
            <InputKataSandi
              label="Konfirmasi kata sandi"
              placeholder="Ulangi kata sandi"
              value={konfirmasi}
              onChange={(e) => setKonfirmasi(e.target.value)}
              error={errors.konfirmasi}
            />
          </div>
          <Button type="submit" className="h-12 w-full" disabled={memuat}>
            {memuat ? "Memproses..." : "Daftar"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
