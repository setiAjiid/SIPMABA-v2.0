import { decodeBase64 } from "./encoding.js";

const ENCODER = new TextEncoder();

const HKDF_INFO = "my-go-api/v3";
const AES_KEY_LENGTH = 16;
const HMAC_KEY_LENGTH = 32;

export async function createClientKeyPair() {
  try {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "X25519",
      },
      true,
      ["deriveBits"],
    );

    const publicKey = new Uint8Array(
      await crypto.subtle.exportKey("raw", keyPair.publicKey),
    );

    return {
      privateKey: keyPair.privateKey,
      publicKey,
    };
  } catch {
    throw new Error("Browser does not support X25519 key exchange");
  }
}

export async function deriveSessionKeys(
  clientPrivateKey,
  serverPublicKeyBase64,
  sessionID,
) {
  let sharedSecret;

  try {
    const serverPublicKey = await crypto.subtle.importKey(
      "raw",
      decodeBase64(serverPublicKeyBase64),
      {
        name: "X25519",
      },
      false,
      [],
    );

    sharedSecret = await crypto.subtle.deriveBits(
      {
        name: "X25519",
        public: serverPublicKey,
      },
      clientPrivateKey,
      256,
    );
  } catch {
    throw new Error("Failed to derive X25519 shared secret");
  }

  try {
    const hkdfKey = await crypto.subtle.importKey(
      "raw",
      sharedSecret,
      "HKDF",
      false,
      ["deriveBits"],
    );

    const derivedKeys = new Uint8Array(
      await crypto.subtle.deriveBits(
        {
          name: "HKDF",
          hash: "SHA-256",
          salt: ENCODER.encode(sessionID),
          info: ENCODER.encode(HKDF_INFO),
        },
        hkdfKey,
        (AES_KEY_LENGTH + HMAC_KEY_LENGTH) * 8,
      ),
    );

    const aesKeyBytes = derivedKeys.slice(0, AES_KEY_LENGTH);
    const hmacKeyBytes = derivedKeys.slice(
      AES_KEY_LENGTH,
      AES_KEY_LENGTH + HMAC_KEY_LENGTH,
    );

    const [aesKey, hmacKey] = await Promise.all([
      crypto.subtle.importKey(
        "raw",
        aesKeyBytes,
        {
          name: "AES-CTR",
        },
        false,
        ["encrypt", "decrypt"],
      ),

      crypto.subtle.importKey(
        "raw",
        hmacKeyBytes,
        {
          name: "HMAC",
          hash: "SHA-256",
        },
        false,
        ["sign", "verify"],
      ),
    ]);

    return {
      aesKey,
      hmacKey,
    };
  } catch {
    throw new Error("Failed to derive session encryption keys");
  }
}
