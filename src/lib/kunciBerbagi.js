// Kriptografi fitur Berbagi Data, seluruhnya lewat WebCrypto.
//
// - Pasangan kunci pengguna: RSA-OAEP 2048 bit dengan SHA-256.
// - Kunci pribadi disimpan terbungkus AES-256-GCM; kunci pembungkusnya
//   diturunkan dari kata sandi dengan PBKDF2-SHA256.
// - Kunci bersama: AES-256 acak, satu per permintaan.
// - Paket kunci: kunci bersama yang dienkripsi dengan kunci publik peminta,
//   ditulis sebagai base64 supaya bisa dikirim lewat email atau WhatsApp.

const RSA = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
};
const ITERASI_PBKDF2 = 310000;
export const PANJANG_SANDI_MIN = 8;

// Galat dengan pesan yang aman ditampilkan apa adanya kepada pengguna.
export class GalatKunci extends Error {}

const keB64 = (buffer) => {
  let biner = "";
  for (const b of new Uint8Array(buffer)) biner += String.fromCharCode(b);
  return btoa(biner);
};

const dariB64 = (teks) => Uint8Array.from(atob(teks), (c) => c.charCodeAt(0));

// Delapan byte pertama SHA-256, ditulis "9F2A 41C7 B03E 5D18".
export async function sidikDari(bytes) {
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const hex = Array.from(hash.slice(0, 8), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  return hex.toUpperCase().match(/.{4}/g).join(" ");
}

async function kunciDariSandi(kataSandi, salt, iterasi) {
  const bahan = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(kataSandi),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: iterasi },
    bahan,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

// Hasilnya aman disimpan apa adanya: kunci pribadi hanya ada dalam bentuk
// terbungkus kata sandi.
export async function buatPasanganKunci(kataSandi) {
  const pasangan = await crypto.subtle.generateKey(RSA, true, [
    "encrypt",
    "decrypt",
  ]);
  const spki = await crypto.subtle.exportKey("spki", pasangan.publicKey);
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", pasangan.privateKey);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const pembungkus = await kunciDariSandi(kataSandi, salt, ITERASI_PBKDF2);
  const terbungkus = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    pembungkus,
    pkcs8,
  );
  return {
    versi: 1,
    algoritma: "RSA-OAEP-2048-SHA256",
    publik: keB64(spki),
    sidik: await sidikDari(spki),
    dibuat: new Date().toISOString(),
    pribadi: {
      pembungkus: "PBKDF2-SHA256/AES-256-GCM",
      iterasi: ITERASI_PBKDF2,
      salt: keB64(salt),
      iv: keB64(iv),
      data: keB64(terbungkus),
    },
  };
}

export async function bukaKunciPribadi(kunci, kataSandi) {
  const { iterasi, salt, iv, data } = kunci.pribadi;
  const pembungkus = await kunciDariSandi(kataSandi, dariB64(salt), iterasi);
  let pkcs8;
  try {
    pkcs8 = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: dariB64(iv) },
      pembungkus,
      dariB64(data),
    );
  } catch {
    throw new GalatKunci("Kata sandi kunci pribadi salah.");
  }
  return crypto.subtle.importKey("pkcs8", pkcs8, RSA, false, ["decrypt"]);
}

export async function buatKunciBersama() {
  const kunci = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const mentah = new Uint8Array(await crypto.subtle.exportKey("raw", kunci));
  return { mentah, sidik: await sidikDari(mentah) };
}

export async function bungkusKunci(mentah, publikB64) {
  const publik = await crypto.subtle.importKey(
    "spki",
    dariB64(publikB64),
    RSA,
    false,
    ["encrypt"],
  );
  return keB64(await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publik, mentah));
}

// Mengambil paket dari teks tempelan atau isi berkas. Pesan email atau
// WhatsApp boleh ikut tertempel; base64 yang terpotong baris disambung lagi.
export function ambilPaket(teks) {
  const rapat = teks.replace(/\s+/g, "");
  const base64 = /^[A-Za-z0-9+/]+={0,2}$/;
  if (base64.test(rapat) && rapat.length % 4 === 0) return rapat;
  const calon = teks
    .split(/\s+/)
    .filter((t) => t.length >= 300 && t.length % 4 === 0 && base64.test(t))
    .sort((a, b) => b.length - a.length);
  return calon[0] ?? null;
}

// Mengembalikan kunci bersama mentah beserta sidiknya.
export async function bukaPaket(teks, kunciPribadi) {
  const paket = ambilPaket(teks);
  if (!paket) {
    throw new GalatKunci(
      "Format paket kunci tidak dikenali. Tempel paket persis seperti yang dikirim pemilik.",
    );
  }
  let mentah;
  try {
    mentah = new Uint8Array(
      await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        kunciPribadi,
        dariB64(paket),
      ),
    );
  } catch {
    throw new GalatKunci(
      "Paket kunci tidak dapat dibuka dengan kunci pribadi Anda. Pastikan paket disalin utuh dan dibuat untuk kunci publik Anda yang sekarang.",
    );
  }
  if (mentah.length !== 32) {
    throw new GalatKunci("Isi paket bukan kunci AES-256 yang sah.");
  }
  return { mentah, sidik: await sidikDari(mentah) };
}

export function pemPublik(publikB64) {
  const baris = publikB64.match(/.{1,64}/g).join("\n");
  return `-----BEGIN PUBLIC KEY-----\n${baris}\n-----END PUBLIC KEY-----\n`;
}
