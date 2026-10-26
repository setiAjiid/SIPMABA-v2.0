import { NavLink } from "react-router-dom";
import { Lock } from "lucide-react";

const tabBase =
  "flex h-10 flex-1 items-center justify-center rounded-md text-sm font-bold transition-colors";
const tabAktif = "bg-surface text-brand shadow-card";
const tabTidakAktif = "text-muted hover:text-ink";

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-brand p-12 text-surface lg:flex">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold">SIPMABA</span>
          <span className="text-xs font-semibold tracking-widest opacity-70">
            KEAMANAN DATA MAHASISWA
          </span>
        </div>

        <div className="flex max-w-md flex-col gap-4">
          <h2 className="text-4xl font-bold leading-tight">
            Data pendaftaran Anda tersimpan terenkripsi
          </h2>
          <p className="text-sm opacity-80">
            Dokumen dan informasi pribadi Anda dilindungi selama proses
            penerimaan mahasiswa baru.
          </p>
        </div>

        <p className="text-xs opacity-70">
          Sistem Informasi Penerimaan Mahasiswa Baru
          <br />
          Institut Teknologi Sepuluh Nopember
        </p>
      </aside>

      <main className="flex flex-col items-center justify-center gap-6 bg-background p-6">
        <div className="text-center">
          <p className="text-sm text-muted">Selamat datang di</p>
          <h1 className="text-2xl font-bold text-ink">Portal SIPMABA</h1>
        </div>

        <nav className="flex w-full max-w-md gap-1 rounded-lg bg-brand-soft p-1">
          <NavLink
            to="/masuk"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabAktif : tabTidakAktif}`
            }
          >
            Masuk
          </NavLink>
          <NavLink
            to="/daftar"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabAktif : tabTidakAktif}`
            }
          >
            Daftar
          </NavLink>
        </nav>

        {children}

        <div className="flex flex-col items-center gap-1 text-xs text-muted">
          <p className="flex items-center gap-2">
            <Lock size={14} />
            Data Anda dikirim melalui koneksi terenkripsi.
          </p>
          <p>
            Butuh bantuan?{" "}
            <a href="#" className="font-semibold text-brand hover:underline">
              Hubungi pusat bantuan
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
