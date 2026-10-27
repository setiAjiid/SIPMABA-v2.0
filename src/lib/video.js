import { panggil } from "./api";
import { bacaBase64 } from "./berkas";

// Video dikirim per potongan (ukurannya ditentukan server, 512 KB) karena
// satu amplop enkripsi in-transit maksimal 1 MiB. Setiap potongan
// dienkripsi server dengan AES, DES, dan RC4.
export async function unggahVideo(file, lapor) {
  const potonganAwal = 512 * 1024;
  const jumlah = Math.ceil(file.size / potonganAwal);
  const mulai = await panggil("/videos", {
    method: "POST",
    body: {
      chunk_count: jumlah,
      size_bytes: file.size,
      nama_asli: file.name,
      tipe_mime: file.type,
    },
  });
  const ukuran = mulai.chunk_bytes;
  for (let i = 0; i < jumlah; i++) {
    lapor?.(`Mengunggah ${Math.round((i / jumlah) * 100)}%`);
    const isi = await bacaBase64(file.slice(i * ukuran, (i + 1) * ukuran));
    await panggil(`/videos/${mulai.video_id}/chunks/${i}`, {
      method: "PUT",
      body: { data: isi },
    });
  }
  lapor?.("");
  return mulai.video_id;
}

export async function unduhVideo(berkas, algoritma, lapor) {
  const bagian = [];
  let jumlah = 1;
  for (let i = 0; i < jumlah; i++) {
    const res = await panggil(
      `/videos/${berkas.id}/chunks/${i}?algoritma=${algoritma}`,
    );
    jumlah = res.chunk_count;
    bagian.push(Uint8Array.from(atob(res.data), (c) => c.charCodeAt(0)));
    lapor?.(`Mendekripsi ${Math.round(((i + 1) / jumlah) * 100)}%`);
  }
  lapor?.("");

  const url = URL.createObjectURL(new Blob(bagian, { type: berkas.tipe_mime }));
  const tautan = document.createElement("a");
  tautan.href = url;
  tautan.download = berkas.nama_asli;
  tautan.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Pratinjau ciphertext potongan pertama (berkas disimpan per potongan).
export async function ambilCiphertextVideo(berkas, algoritma) {
  const res = await panggil(
    `/videos/${berkas.id}/chunks/0/ciphertext?algoritma=${algoritma}`,
  );
  return {
    isi: res.ciphertext,
    keterangan: `potongan 1 dari ${res.chunk_count}`,
  };
}
