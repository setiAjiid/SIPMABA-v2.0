import { useState } from "react";
import CatatanKhusus from "./biodata/CatatanKhusus";
import DataDiri from "./biodata/DataDiri";
import Pendidikan from "./biodata/Pendidikan";
import Pendukung from "./biodata/Pendukung";
import Rumah from "./biodata/Rumah";

const tabs = [
  { id: "data-diri", label: "Data Diri" },
  { id: "pendidikan", label: "Pendidikan" },
  { id: "keluarga", label: "Keluarga" },
  { id: "rumah", label: "Rumah" },
  { id: "catatan-khusus", label: "Catatan Khusus" },
  { id: "pendukung", label: "Pendukung" },
];

const isi = {
  "data-diri": DataDiri,
  pendidikan: Pendidikan,
  rumah: Rumah,
  "catatan-khusus": CatatanKhusus,
  pendukung: Pendukung,
};

export default function Biodata() {
  const [tab, setTab] = useState("data-diri");
  const Isi = isi[tab];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">Biodata</h1>
      <div className="flex w-fit flex-wrap gap-1 rounded-lg bg-brand-soft p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-4 py-2 text-sm font-bold ${
              tab === t.id ? "bg-surface text-brand shadow-card" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <section className="rounded-2xl bg-surface p-6 shadow-card">
        {Isi ? (
          <Isi />
        ) : (
          <p className="text-sm text-muted">Tab ini menyusul.</p>
        )}
      </section>
    </div>
  );
}
