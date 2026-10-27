import {
  concatenateBytes,
  createRandomBytes,
  createRequestID,
  decodeBase64,
  encodeBase64,
} from "./encoding.js";

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

const VERSION = "v3";
const IV_LENGTH = 16;
const TAG_LENGTH = 32;

function createMacPayload({
  version,
  sessionID,
  requestID,
  direction,
  iv,
  ciphertext,
}) {
  const fields = [
    ENCODER.encode(version),
    ENCODER.encode(sessionID),
    ENCODER.encode(requestID),
    ENCODER.encode(direction),
    iv,
    ciphertext,
  ];

  const parts = [];

  for (const field of fields) {
    const lengthPrefix = new Uint8Array(8);
    const view = new DataView(lengthPrefix.buffer);

    view.setBigUint64(0, BigInt(field.length), false);

    parts.push(lengthPrefix, field);
  }

  return concatenateBytes(...parts);
}

async function createHMACTag(session, payload) {
  return new Uint8Array(
    await crypto.subtle.sign("HMAC", session.hmacKey, payload),
  );
}

async function verifyHMACTag(session, tag, payload) {
  return crypto.subtle.verify("HMAC", session.hmacKey, tag, payload);
}

export async function createEnvelope(session, body) {
  const requestID = createRequestID();
  const iv = createRandomBytes(IV_LENGTH);

  const plaintext = ENCODER.encode(
    body === undefined ? "null" : JSON.stringify(body),
  );

  let ciphertext;

  try {
    ciphertext = new Uint8Array(
      await crypto.subtle.encrypt(
        {
          name: "AES-CTR",
          counter: iv,
          length: 128,
        },
        session.aesKey,
        plaintext,
      ),
    );
  } catch {
    throw new Error("Failed to encrypt request");
  }

  const fields = {
    version: VERSION,
    sessionID: session.sessionID,
    requestID,
    direction: "request",
    iv,
    ciphertext,
  };

  const tag = await createHMACTag(session, createMacPayload(fields));

  return {
    requestID,
    envelope: {
      version: VERSION,
      session_id: session.sessionID,
      request_id: requestID,
      direction: "request",
      iv: encodeBase64(iv),
      ciphertext: encodeBase64(ciphertext),
      tag: encodeBase64(tag),
    },
  };
}

function isEncryptedEnvelope(data) {
  return (
    data !== null &&
    typeof data === "object" &&
    typeof data.version === "string" &&
    typeof data.session_id === "string" &&
    typeof data.request_id === "string" &&
    typeof data.direction === "string" &&
    typeof data.iv === "string" &&
    typeof data.ciphertext === "string" &&
    typeof data.tag === "string"
  );
}

export async function openEnvelope(data, session, expectedRequestID) {
  if (!isEncryptedEnvelope(data)) {
    throw new Error("Invalid encrypted response envelope");
  }

  if (
    data.version !== VERSION ||
    data.session_id !== session.sessionID ||
    data.request_id !== expectedRequestID ||
    data.direction !== "response"
  ) {
    throw new Error("Encrypted response identity mismatch");
  }

  let iv;
  let ciphertext;
  let tag;

  try {
    iv = decodeBase64(data.iv);
    ciphertext = decodeBase64(data.ciphertext);
    tag = decodeBase64(data.tag);
  } catch {
    throw new Error("Invalid encrypted response encoding");
  }

  if (iv.length !== IV_LENGTH || tag.length !== TAG_LENGTH) {
    throw new Error("Invalid encrypted response field length");
  }

  const fields = {
    version: data.version,
    sessionID: data.session_id,
    requestID: data.request_id,
    direction: data.direction,
    iv,
    ciphertext,
  };

  const validTag = await verifyHMACTag(session, tag, createMacPayload(fields));

  if (!validTag) {
    throw new Error("Encrypted response authentication failed");
  }

  let plaintext;

  try {
    plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-CTR",
        counter: iv,
        length: 128,
      },
      session.aesKey,
      ciphertext,
    );
  } catch {
    throw new Error("Failed to decrypt response");
  }

  try {
    return JSON.parse(DECODER.decode(plaintext));
  } catch {
    throw new Error("Invalid decrypted response JSON");
  }
}

export { isEncryptedEnvelope };
