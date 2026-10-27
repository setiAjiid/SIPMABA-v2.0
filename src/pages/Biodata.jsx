import { useState } from "react";
import SidebarLayout from "../layouts/SidebarLayout";
import CatatanKhusus from "./biodata/CatatanKhusus";
import DataDiri from "./biodata/DataDiri";
import Keluarga from "./biodata/Keluarga";
import Pendidikan from "./biodata/Pendidikan";
import Pendukung from "./biodata/Pendukung";
import Rumah from "./biodata/Rumah";

const tabs = [
  {
    id: "data-diri",
    label: "Data Diri",
    keterangan: "Semua isian disimpan terenkripsi dengan AES, DES, dan RC4.",
  },
  {
    id: "pendidikan",
    label: "Pendidikan",
    keterangan:
      "Lengkapi riwayat sekolah dan nilai TKA untuk kebutuhan seleksi.",
  },
  {
    id: "keluarga",
    label: "Keluarga",
    keterangan: "Lengkapi data orang tua atau wali dan informasi keluarga.",
  },
  {
    id: "rumah",
    label: "Rumah",
    keterangan: "Lengkapi informasi kondisi tempat tinggal keluarga.",
  },
  {
    id: "catatan-khusus",
    label: "Catatan Khusus",
    keterangan:
      "Lengkapi rencana tempat tinggal, kondisi khusus, dan dokumen pribadi.",
  },
  {
    id: "pendukung",
    label: "Pendukung",
    keterangan: "Data kemampuan ekonomi orang tua.",
  },
];

const isi = {
  "data-diri": DataDiri,
  pendidikan: Pendidikan,
  keluarga: Keluarga,
  rumah: Rumah,
  "catatan-khusus": CatatanKhusus,
  pendukung: Pendukung,
};

// sementara, nanti dari backend
const tersimpan = {
  "data-diri": true,
  pendidikan: true,
  keluarga: true,
  rumah: true,
};

export default function Biodata() {
  const [tab, setTab] = useState("data-diri");
  const Isi = isi[tab];
  const aktif = tabs.find((t) => t.id === tab);
  const menu = tabs.map((t) => ({
    id: t.id,
    label: t.label,
    status: !!tersimpan[t.id],
  }));

  return (
    <SidebarLayout judul="BIODATA" menu={menu} aktif={tab} onPilih={setTab}>
      <div className="flex max-w-[876px] flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            {aktif.label}
          </h1>
          <p className="text-sm text-muted">{aktif.keterangan}</p>
        </div>
        <Isi />
      </div>
    </SidebarLayout>
  );
}
