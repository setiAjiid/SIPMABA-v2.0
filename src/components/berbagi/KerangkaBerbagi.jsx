import { NavLink } from "react-router-dom";
import { jumlahMenunggu, useBerbagi } from "../../lib/berbagi";

const tab = [
  { to: "/berbagi", label: "Cari pengguna", end: true },
  { to: "/berbagi/permintaan", label: "Permintaan saya" },
  { to: "/berbagi/kotak-masuk", label: "Kotak masuk", jumlah: true },
  { to: "/berbagi/kunci", label: "Kunci saya" },
];

// Kerangka bersama halaman Berbagi: sapaan, judul, dan tab navigasi.
export default function KerangkaBerbagi({ judul, keterangan, children }) {
  const { masuk } = useBerbagi();
  const menunggu = jumlahMenunggu(masuk);

  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-20">
      <div className="flex max-w-[960px] flex-col gap-10">
        <div className="flex flex-col gap-2 border-b border-border pb-8">
          <p className="text-sm font-semibold text-muted">Berbagi data</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            {judul}
          </h1>
          <p className="text-sm leading-6 text-muted">{keterangan}</p>
        </div>

        <nav
          aria-label="Berbagi data"
          className="flex gap-2 overflow-x-auto border-b border-border"
        >
          {tab.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 border-b-[3px] px-4 py-3 text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus ${
                  isActive
                    ? "border-brand font-bold text-brand"
                    : "border-transparent font-medium text-muted hover:text-ink"
                }`
              }
            >
              {t.label}
              {t.jumlah && menunggu > 0 && (
                <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-surface">
                  {menunggu}
                  <span className="sr-only"> permintaan menunggu</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {children}
      </div>
    </div>
  );
}
