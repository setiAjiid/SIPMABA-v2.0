import { panggil } from "./api";
import { bacaBase64 } from "./berkas";

const UKURAN_POTONGAN = 256 * 1024;

// Dokumen dikirim per potongan 256 KB.
export async function unggahDokumen(file, lapor) {
  const jumlah = Math.ceil(file.size / UKURAN_POTONGAN);

  const mulai = await panggil("/documents", {
    method: "POST",
    body: {
      filename: file.name,
      size_bytes: file.size,
    },
  });

  const ukuran = mulai.chunk_bytes ?? UKURAN_POTONGAN;

  for (let i = 0; i < jumlah; i++) {
    lapor?.(`Mengunggah ${Math.round((i / jumlah) * 100)}%`);

    const isi = await bacaBase64(
      file.slice(i * ukuran, Math.min((i + 1) * ukuran, file.size)),
    );

    await panggil(`/documents/${mulai.document_id}/chunks/${i}`, {
      method: "PUT",
      body: { data: isi },
    });
  }

  lapor?.("");
  return mulai.document_id;
}

// Mengunduh dokumen dan mendekripsi setiap potongan.
export async function unduhDokumen(dokumen, algoritma = "AES", lapor) {
  const bagian = [];
  let jumlah = 1;
  let metadata;

  for (let i = 0; i < jumlah; i++) {
    const res = await panggil(
      `/documents/${dokumen.id}/chunks/${i}?algoritma=${encodeURIComponent(algoritma)}`,
    );

    jumlah = res.chunk_count;
    metadata = res;

    bagian.push(Uint8Array.from(atob(res.data), (c) => c.charCodeAt(0)));

    lapor?.(`Mengunduh ${Math.round(((i + 1) / jumlah) * 100)}%`);
  }

  lapor?.("");

  const nama = metadata.filename || dokumen.filename || "dokumen";
  const tipe =
    metadata.content_type || dokumen.content_type || "application/octet-stream";

  const url = URL.createObjectURL(new Blob(bagian, { type: tipe }));

  const tautan = document.createElement("a");
  tautan.href = url;
  tautan.download = nama;
  document.body.appendChild(tautan);
  tautan.click();
  tautan.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
