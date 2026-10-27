import { useCallback, useEffect, useState } from "react";
import { panggil } from "./api";

export const ALGORITMA = ["AES", "DES", "RC4"];

function bacaBase64(file) {
  return new Promise((selesai, gagal) => {
    const pembaca = new FileReader();
    pembaca.onload = () => selesai(String(pembaca.result).split(",", 2)[1]);
    pembaca.onerror = () => gagal(pembaca.error);
    pembaca.readAsDataURL(file);
  });
}

// Berkas dikirim sebagai base64 di dalam amplop terenkripsi; server
// mengenkripsinya dengan AES, DES, dan RC4 lalu hanya menyimpan ciphertext.
export async function unggahBerkas(kode, file) {
  const res = await panggil(`/berkas/${kode}`, {
    method: "POST",
    body: {
      nama_asli: file.name,
      tipe_mime: file.type,
      isi_base64: await bacaBase64(file),
    },
  });
  return res.data;
}

export const hapusBerkas = (id) =>
  panggil(`/berkas/${id}`, { method: "DELETE", body: {} });

export async function ambilIsiBerkas(id, algoritma) {
  const res = await panggil(`/berkas/${id}/unduh?algoritma=${algoritma}`);
  const bytes = Uint8Array.from(atob(res.data.isi_base64), (c) =>
    c.charCodeAt(0),
  );
  return { ...res.data, blob: new Blob([bytes], { type: res.data.tipe_mime }) };
}

export async function unduhBerkas(id, algoritma) {
  const { blob, nama_asli } = await ambilIsiBerkas(id, algoritma);
  const url = URL.createObjectURL(blob);
  const tautan = document.createElement("a");
  tautan.href = url;
  tautan.download = nama_asli;
  tautan.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function ambilCiphertext(id, algoritma) {
  const res = await panggil(`/berkas/${id}/ciphertext?algoritma=${algoritma}`);
  return res.data.ciphertext;
}

export const formatUkuran = (byte) =>
  byte >= 1024 * 1024
    ? `${(byte / 1024 / 1024).toFixed(1).replace(".", ",")} MB`
    : `${Math.round(byte / 1024)} KB`;

// null selama memuat. muatUlang dipanggil setelah unggah atau hapus.
export function useDaftarBerkas() {
  const [daftar, setDaftar] = useState(null);
  const [putaran, setPutaran] = useState(0);

  useEffect(() => {
    let batal = false;
    panggil("/berkas")
      .then((res) => {
        if (!batal) setDaftar(res.data);
      })
      .catch(() => {
        if (!batal) setDaftar({ berkas: [], jumlah: 0, total_ukuran_byte: 0 });
      });
    return () => {
      batal = true;
    };
  }, [putaran]);

  const muatUlang = useCallback(() => setPutaran((p) => p + 1), []);
  return [daftar, muatUlang];
}
