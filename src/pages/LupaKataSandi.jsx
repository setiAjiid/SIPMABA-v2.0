import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";
import { panggil } from "../lib/api";

export default function LupaKataSandi() {
  const [email, setEmail] = useState("");
  const [galat, setGalat] = useState("");
  const [terkirim, setTerkirim] = useState(false);
  const [memuat, setMemuat] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const nilai = email.trim();
    if (!nilai) {
      setGalat("Email wajib diisi");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(nilai)) {
      setGalat("Format email tidak valid");
      return;
    }
    setGalat("");
    setTerkirim(false);
    setMemuat(true);
    try {
      await panggil("/auth/lupa_katasandi", {
        method: "POST",
        body: { email: nilai },
      });
      setTerkirim(true);
    } catch (err) {
      setGalat(err.message);
    } finally {
      setMemuat(false);
    }
  }

  return (
    <AuthLayout tanpaTab>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-ink">Reset kata sandi</h2>
          <p className="text-sm text-muted">
            Masukkan email akun Anda untuk menerima instruksi reset.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={galat}
          />
          <Button type="submit" className="h-12 w-full" disabled={memuat}>
            {memuat ? "Mengirim..." : "Kirim instruksi reset"}
          </Button>
        </form>

        {terkirim && (
          <p
            role="status"
            className="rounded-lg bg-brand-soft px-4 py-3 text-sm text-ink"
          >
            Jika email terdaftar, instruksi reset akan dikirim ke kotak masuk
            Anda.
          </p>
        )}

        <Link
          to="/masuk"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border text-sm font-bold text-brand hover:bg-brand-soft"
        >
          Kembali ke halaman masuk
        </Link>
      </div>
    </AuthLayout>
  );
}
