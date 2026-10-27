import { NavLink } from "react-router-dom";
import { Lock } from "lucide-react";
import logoIts from "../assets/logo-its.svg";

const tabBase =
  "flex h-10 flex-1 items-center justify-center rounded-md text-sm font-bold transition-colors";
const tabAktif = "bg-surface text-brand shadow-card";
const tabTidakAktif = "text-muted hover:text-ink";

const heks = `a4c1 23b1 612d d272 d137 1c17
7f09 e5a2 3c4d 91b8 0a6e f2d5
c83b 5710 ae2f 64d9 b1c0 38e7
2d96 f4a1 07bc 8e53 c9d2 15fa
e174 b3a8 5d6c 20f9 7ea4 c18b
59cf 0d82 a7e3 46b1 f8c5 2a90
b6d4 31ef 9c07 d5a8 6e2b 43f1
0fa3 c7e9 58d0 b24c 71a6 ed39
94b5 e20c 6fd7 3a81 c5f4 08be`;

const lingkar = [192, 320, 448, 576, 704, 832];

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[648fr_792fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-b from-brand to-[#0b2c5c] px-20 py-14 text-surface lg:flex">
        {/* dekorasi */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[380px] top-[-160px] size-[420px] rounded-full bg-surface/7 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[244px] top-[-356px] size-[832px]"
          style={{
            maskImage:
              "radial-gradient(circle, transparent 10%, black 45%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle, transparent 10%, black 45%, transparent 75%)",
          }}
        >
          {lingkar.map((d) => (
            <span
              key={d}
              className="absolute rounded-full border border-surface/12"
              style={{
                width: d,
                height: d,
                left: (832 - d) / 2,
                top: (832 - d) / 2,
              }}
            />
          ))}
        </div>
        <img
          src={logoIts}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-24 w-[640px] opacity-50"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 45%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 45%, transparent 100%)",
          }}
        />
        <pre
          aria-hidden
          className="pointer-events-none absolute left-16 top-[45%] font-mono text-xs leading-8 tracking-[0.16em] text-surface/17"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 35%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 35%, transparent)",
          }}
        >
          {heks}
        </pre>

        {/* isi */}
        <span className="relative text-sm font-semibold tracking-[0.28em]">
          SIPMABA
        </span>

        <div className="relative flex max-w-[488px] flex-col gap-5">
          <div className="h-px w-12 bg-[#c9a96a]" />
          <span className="text-xs font-semibold tracking-[0.22em] text-surface/60">
            KEAMANAN DATA MAHASISWA
          </span>
          <h2 className="text-[44px] font-semibold leading-[1.15] tracking-[-0.025em]">
            Data pendaftaran Anda tersimpan terenkripsi
          </h2>
          <p className="text-base leading-[26px] text-surface/70">
            Dokumen dan informasi pribadi Anda dilindungi selama proses
            penerimaan mahasiswa baru.
          </p>
        </div>

        <p className="relative max-w-[488px] border-t border-surface/15 pt-6 text-xs leading-[18px] text-surface/60">
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
