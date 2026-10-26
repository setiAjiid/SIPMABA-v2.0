import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";

export default function Masuk() {
  const [namaPengguna, setNamaPengguna] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const baru = {};
    if (!namaPengguna.trim()) baru.namaPengguna = "Nama pengguna wajib diisi";
    if (!kataSandi) baru.kataSandi = "Kata sandi wajib diisi";
    setErrors(baru);
    if (Object.keys(baru).length === 0) {
      console.log("Valid, siap dikirim", { namaPengguna });
    }
  }

  return (
    <AuthLayout>
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-surface p-10 shadow-card">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-ink">Masuk ke akun Anda</h2>
          <p className="text-sm text-muted">
            Gunakan nama pengguna dan kata sandi yang terdaftar.
          </p>
        </div>

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
              label="Kata sandi"
              type="password"
              placeholder="Masukkan kata sandi"
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
              error={errors.kataSandi}
            />
            <a
              href="#"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Lupa kata sandi?
            </a>
          </div>
          <Button type="submit" className="w-full">
            Masuk
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
