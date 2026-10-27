import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import InputKataSandi from "../components/InputKataSandi";
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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-ink">Masuk ke akun Anda</h2>
          <p className="text-sm text-muted">
            Lanjutkan proses pendaftaran mahasiswa baru.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-5">
            <Input
              label="Nama pengguna"
              placeholder="Masukkan nama pengguna"
              value={namaPengguna}
              onChange={(e) => setNamaPengguna(e.target.value)}
              error={errors.namaPengguna}
            />
            <InputKataSandi
              label="Kata sandi"
              placeholder="Masukkan kata sandi"
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
              error={errors.kataSandi}
              aksiLabel={
                <a
                  href="#"
                  className="text-sm font-bold text-brand hover:underline"
                >
                  Lupa kata sandi?
                </a>
              }
            />
          </div>
          <Button type="submit" className="h-12 w-full">
            Masuk
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
