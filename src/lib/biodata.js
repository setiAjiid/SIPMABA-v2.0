// Relasi biodata yang belum pernah disimpan dikirim backend dengan id kosong.
export const ID_KOSONG = "00000000-0000-0000-0000-000000000000";

// Pilihan boleh berupa teks biasa atau { nilai, label } bila nilai yang
// dikirim ke backend berbeda dari teks yang dilihat pengguna.
export const nilaiPilihan = (p) => (typeof p === "string" ? p : p.nilai);
export const labelPilihan = (p) => (typeof p === "string" ? p : p.label);

export const yaTidak = [
  { nilai: "true", label: "Ya" },
  { nilai: "false", label: "Tidak" },
];

export const ratakan = (kolom) => kolom.flatMap((k) => k.anak ?? [k]);

// kunci memetakan nama kolom form ke nama field backend. Saat mengirim,
// titik berarti objek bertingkat ("ayah.nik" menjadi { ayah: { nik } }).
// Saat membaca, backend memakai bentuk datar, jadi titik diganti "_".
export function keBackend(semuaKolom, kunci, form) {
  const body = {};
  for (const k of semuaKolom) {
    const jalur = kunci[k.nama];
    if (!jalur || k.bacaSaja) continue;

    let nilai = form[k.nama];
    if (k.boolean) nilai = nilai === "true";
    else if (k.angka || k.bilangan) nilai = nilai === "" ? 0 : Number(nilai);
    else if (typeof nilai === "string") {
      nilai = nilai.trim();
      if (k.padKiri && nilai) nilai = nilai.padStart(k.padKiri, "0");
    }

    const bagian = jalur.split(".");
    let tujuan = body;
    for (const b of bagian.slice(0, -1)) tujuan = tujuan[b] ??= {};
    tujuan[bagian.at(-1)] = nilai;
  }
  return body;
}

export function dariBackend(semuaKolom, kunci, data) {
  const isi = {};
  for (const k of semuaKolom) {
    const jalur = kunci[k.nama];
    if (!jalur) continue;
    const nilai = data[jalur.replaceAll(".", "_")];
    if (nilai === undefined || nilai === null) continue;
    isi[k.nama] =
      k.tipe === "date" ? String(nilai).slice(0, 10) : String(nilai);
  }
  return isi;
}
