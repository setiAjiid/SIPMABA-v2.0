import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import InputKataSandi from "../components/InputKataSandi";
import AuthLayout from "../layouts/AuthLayout";
import { panggil, simpanNama, simpanToken } from "../lib/api";

export default function Masuk() {
  const [namaPengguna, setNamaPengguna] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [errors, setErrors] = useState({});
  const [galat, setGalat] = useState("");
  const [memuat, setMemuat] = useState(false);
  const navigate = useNavigate();
  const pesanMasuk = useLocation().state?.pesan;

  async function handleSubmit(e) {
    e.preventDefault();
    const baru = {};
    if (!namaPengguna.trim()) baru.namaPengguna = "Nama pengguna wajib diisi";
    if (!kataSandi) baru.kataSandi = "Kata sandi wajib diisi";
    setErrors(baru);
    if (Object.keys(baru).length > 0) return;

    setGalat("");
    setMemuat(true);
    try {
      const res = await panggil("/auth/masuk", {
        method: "POST",
        body: { nama_pengguna: namaPengguna.trim(), kata_sandi: kataSandi },
      });
      simpanToken(res.data.token);
      simpanNama(res.data.nama_pengguna);
      navigate("/beranda", { replace: true });
    } catch (err) {
      setGalat(err.message);
      setMemuat(false);
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

        {pesanMasuk && !galat && (
          <p
            role="status"
            className="rounded-lg bg-brand-soft px-4 py-3 text-sm text-ink"
          >
            {pesanMasuk}
          </p>
        )}
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
                <Link
                  to="/lupa-kata-sandi"
                  className="text-sm font-bold text-brand hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              }
            />
          </div>
          <Button type="submit" className="h-12 w-full" disabled={memuat}>
            {memuat ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
