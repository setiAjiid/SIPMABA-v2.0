// Enkripsi data saat dikirim (in-transit), pasangan dari
// utils/session_crypto.go dan middleware/encryption.go di backend:
// X25519 untuk tukar kunci, HKDF-SHA256 untuk menurunkan kunci sesi,
// AES-128-CTR untuk isi, dan HMAC-SHA256 untuk keaslian amplop.

const VERSI = "v3";
const INFO_HKDF = "my-go-api/v3";
const KUNCI_SESI = "sipmaba_sesi";
// Sesi diperbarui sedikit lebih awal agar tidak kedaluwarsa di tengah jalan.
const JEDA_MS = 30 * 1000;

const teks = new TextEncoder();
const subtle = globalThis.crypto.subtle;

function keBase64(bytes) {
  const u8 = new Uint8Array(bytes);
  let biner = "";
  // Per potongan, karena spread ribuan argumen bisa melebihi batas fungsi.
  for (let i = 0; i < u8.length; i += 0x8000) {
    biner += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  }
  return btoa(biner);
}
const dariBase64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

function acakHex(panjang) {
  const bytes = crypto.getRandomValues(new Uint8Array(panjang));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Sama dengan sessionAuthenticationTag di Go: setiap field diawali
// panjangnya (8 byte big-endian) sebelum masuk HMAC.
async function hitungTag(kunciMac, amplop) {
  const bagian = [
    teks.encode(amplop.version),
    teks.encode(amplop.session_id),
    teks.encode(amplop.request_id),
    teks.encode(amplop.direction),
    amplop.iv,
    amplop.ciphertext,
  ];
  const total = bagian.reduce((n, b) => n + 8 + b.length, 0);
  const data = new Uint8Array(total);
  const tampilan = new DataView(data.buffer);
  let posisi = 0;
  for (const b of bagian) {
    tampilan.setBigUint64(posisi, BigInt(b.length));
    data.set(b, posisi + 8);
    posisi += 8 + b.length;
  }
  return new Uint8Array(await subtle.sign("HMAC", kunciMac, data));
}

async function imporKunci({ sessionId, aes, mac, expiresAt }) {
  return {
    sessionId,
    expiresAt,
    aes: await subtle.importKey("raw", dariBase64(aes), "AES-CTR", false, [
      "encrypt",
      "decrypt",
    ]),
    mac: await subtle.importKey(
      "raw",
      dariBase64(mac),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    ),
  };
}

// Kunci sesi disimpan di sessionStorage supaya muat ulang halaman tidak
// memicu handshake baru (backend membatasi handshake per menit).
function bacaSimpanan() {
  try {
    const s = JSON.parse(sessionStorage.getItem(KUNCI_SESI));
    if (s && Date.parse(s.expiresAt) - JEDA_MS > Date.now()) return s;
  } catch {
    /* penyimpanan tidak tersedia atau rusak */
  }
  return null;
}

export function lupakanSesi() {
  sesiAktif = null;
  try {
    sessionStorage.removeItem(KUNCI_SESI);
  } catch {
    /* penyimpanan tidak tersedia */
  }
}

async function handshake(base) {
  const pasangan = await subtle.generateKey({ name: "X25519" }, true, [
    "deriveBits",
  ]);
  const publikKlien = await subtle.exportKey("raw", pasangan.publicKey);

  const res = await fetch(`${base}/handshake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_public_key: keBase64(publikKlien) }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const galat = new Error(
      res.status === 429
        ? "Terlalu banyak permintaan sesi, coba lagi sebentar"
        : "Gagal membuat sesi aman dengan server",
    );
    galat.status = res.status;
    throw galat;
  }

  const publikServer = await subtle.importKey(
    "raw",
    dariBase64(data.server_public_key),
    { name: "X25519" },
    false,
    [],
  );
  const rahasia = await subtle.deriveBits(
    { name: "X25519", public: publikServer },
    pasangan.privateKey,
    256,
  );
  const bahan = await subtle.importKey("raw", rahasia, "HKDF", false, [
    "deriveBits",
  ]);
  const kunci = new Uint8Array(
    await subtle.deriveBits(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: teks.encode(data.session_id),
        info: teks.encode(INFO_HKDF),
      },
      bahan,
      (16 + 32) * 8,
    ),
  );

  const simpanan = {
    sessionId: data.session_id,
    aes: keBase64(kunci.slice(0, 16)),
    mac: keBase64(kunci.slice(16)),
    expiresAt: data.expires_at,
  };
  try {
    sessionStorage.setItem(KUNCI_SESI, JSON.stringify(simpanan));
  } catch {
    /* tetap jalan tanpa penyimpanan */
  }
  return imporKunci(simpanan);
}

let sesiAktif = null;

export async function ambilSesi(base) {
  if (sesiAktif) {
    const s = await sesiAktif;
    if (Date.parse(s.expiresAt) - JEDA_MS > Date.now()) return s;
    lupakanSesi();
  }
  const simpanan = bacaSimpanan();
  sesiAktif = simpanan ? imporKunci(simpanan) : handshake(base);
  try {
    return await sesiAktif;
  } catch (err) {
    sesiAktif = null;
    throw err;
  }
}

export async function bungkus(sesi, isi) {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const ciphertext = new Uint8Array(
    await subtle.encrypt(
      { name: "AES-CTR", counter: iv, length: 128 },
      sesi.aes,
      teks.encode(JSON.stringify(isi ?? {})),
    ),
  );
  const amplop = {
    version: VERSI,
    session_id: sesi.sessionId,
    request_id: acakHex(16),
    direction: "request",
    iv,
    ciphertext,
  };
  const tag = await hitungTag(sesi.mac, amplop);
  return {
    ...amplop,
    iv: keBase64(iv),
    ciphertext: keBase64(ciphertext),
    tag: keBase64(tag),
  };
}

// Mengembalikan isi respons dalam bentuk teks JSON. Amplop yang tidak
// cocok dengan permintaannya atau gagal diverifikasi ditolak.
export async function buka(sesi, amplopJson, requestId) {
  const amplop = {
    version: amplopJson.version,
    session_id: amplopJson.session_id,
    request_id: amplopJson.request_id,
    direction: amplopJson.direction,
    iv: dariBase64(amplopJson.iv ?? ""),
    ciphertext: dariBase64(amplopJson.ciphertext ?? ""),
  };
  if (
    amplop.version !== VERSI ||
    amplop.session_id !== sesi.sessionId ||
    amplop.request_id !== requestId ||
    amplop.direction !== "response" ||
    amplop.iv.length !== 16
  ) {
    throw new Error("Amplop respons tidak sesuai");
  }

  const harap = await hitungTag(sesi.mac, amplop);
  const tag = dariBase64(amplopJson.tag ?? "");
  let beda = tag.length ^ harap.length;
  for (let i = 0; i < harap.length; i++) beda |= harap[i] ^ (tag[i] ?? 0);
  if (beda !== 0) throw new Error("Respons server gagal diverifikasi");

  const isi = await subtle.decrypt(
    { name: "AES-CTR", counter: amplop.iv, length: 128 },
    sesi.aes,
    amplop.ciphertext,
  );
  return new TextDecoder().decode(isi);
}

export const amplopKeHeader = (amplop) =>
  btoa(JSON.stringify(amplop));

export const adalahAmplop = (data) =>
  data?.version === VERSI && typeof data?.ciphertext === "string";
