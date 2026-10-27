import { encodeBase64 } from "./crypto/encoding.js";
import {
  createClientKeyPair,
  deriveSessionKeys,
} from "./crypto/key-derivation.js";

const SESSION_EXPIRY_BUFFER_MS = 5000;

let currentSession = null;
let sessionPromise = null;

async function createSession(sendHandshake) {
  const keyPair = await createClientKeyPair();

  const data = await sendHandshake({
    client_public_key: encodeBase64(keyPair.publicKey),
  });

  if (
    !data ||
    typeof data.session_id !== "string" ||
    !data.session_id ||
    typeof data.server_public_key !== "string"
  ) {
    throw new Error("Invalid handshake response");
  }

  const keys = await deriveSessionKeys(
    keyPair.privateKey,
    data.server_public_key,
    data.session_id,
  );

  return {
    sessionID: data.session_id,
    expiresAt: data.expires_at,
    ...keys,
  };
}

function isSessionExpired(session) {
  if (!session) {
    return true;
  }

  if (!session.expiresAt) {
    return false;
  }

  const expiresAt = Date.parse(session.expiresAt);

  if (!Number.isFinite(expiresAt)) {
    return true;
  }

  return expiresAt <= Date.now() + SESSION_EXPIRY_BUFFER_MS;
}

export async function getSession(sendHandshake) {
  if (currentSession && !isSessionExpired(currentSession)) {
    return currentSession;
  }

  currentSession = null;

  if (!sessionPromise) {
    sessionPromise = createSession(sendHandshake);
  }

  try {
    const session = await sessionPromise;

    if (isSessionExpired(session)) {
      throw new Error("New session is already expired");
    }

    currentSession = session;
    return session;
  } finally {
    sessionPromise = null;
  }
}

export function clearSession() {
  currentSession = null;
  sessionPromise = null;
}
