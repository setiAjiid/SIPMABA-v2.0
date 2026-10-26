import Button from "../components/Button";
import Input from "../components/Input";

export default function Masuk() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-surface p-10 shadow-card">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-ink">Masuk ke akun Anda</h1>
          <p className="text-sm text-muted">
            Gunakan nama pengguna dan kata sandi yang terdaftar.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input label="Nama pengguna" placeholder="Masukkan nama pengguna" />
          <Input
            label="Kata sandi"
            type="password"
            placeholder="Masukkan kata sandi"
          />
          <a
            href="#"
            className="text-sm font-semibold text-brand hover:underline"
          >
            Lupa kata sandi?
          </a>
        </div>

        <Button className="w-full">Masuk</Button>
      </div>
    </div>
  );
}
