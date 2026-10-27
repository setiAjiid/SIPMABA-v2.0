import { NavLink, Outlet } from "react-router-dom";

const menu = [
  { to: "/beranda", label: "Beranda" },
  { to: "/biodata", label: "Biodata" },
  { to: "/berkas", label: "Berkas" },
  { to: "/analisis", label: "Analisis" },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 bg-brand text-surface">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <div className="flex h-full items-center gap-10">
            <span className="text-sm font-bold tracking-[0.2em]">SIPMABA</span>
            <nav className="flex h-full gap-1">
              {menu.map((m) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  className={({ isActive }) =>
                    `flex h-full items-center border-b-2 px-3 text-sm transition-colors ${
                      isActive
                        ? "border-surface font-semibold text-surface"
                        : "border-transparent text-surface/70 hover:text-surface"
                    }`
                  }
                >
                  {m.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold">Pengguna</span>
            <NavLink
              to="/masuk"
              className="rounded-lg border border-surface/70 px-4 py-2 transition-colors hover:bg-surface/10"
            >
              Keluar
            </NavLink>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="max-w-[960px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
