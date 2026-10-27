export default function SidebarLayout({
  judul,
  menu,
  aktif,
  onPilih,
  children,
}) {
  return (
    <div className="mx-auto grid max-w-[1200px] md:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="bg-surface px-5 py-5 md:min-h-[calc(100vh-4rem)] md:border-r md:border-border">
        <p className="px-3 pb-3 text-xs font-semibold tracking-widest text-muted">
          {judul}
        </p>
        <nav className="flex flex-col gap-1">
          {menu.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onPilih(m.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors ${
                aktif === m.id
                  ? "bg-brand-soft font-semibold text-brand"
                  : "text-muted hover:text-ink"
              }`}
            >
              {m.status !== undefined && (
                <span
                  className={`size-2 rounded-full ${
                    m.status ? "bg-success" : "bg-border"
                  }`}
                />
              )}
              {m.label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 px-8 py-10">{children}</div>
    </div>
  );
}
