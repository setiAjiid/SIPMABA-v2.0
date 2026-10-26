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
      <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-8">
        <div className="flex items-center gap-10">
          <span className="text-lg font-bold text-brand">SIPMABA</span>
          <nav className="flex gap-1">
            {menu.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-brand-soft text-brand"
                      : "text-muted hover:text-ink"
                  }`
                }
              >
                {m.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted">Pengguna</span>
          <NavLink
            to="/masuk"
            className="font-semibold text-brand hover:underline"
          >
            Keluar
          </NavLink>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-8">
        <Outlet />
      </main>
    </div>
  );
}
