export function encodeBase64(bytes) {
  let binary = "";

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

export function decodeBase64(value) {
  if (typeof value !== "string") {
    throw new Error("Invalid Base64 value");
  }

  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

export function createRandomBytes(length) {
  return crypto.getRandomValues(new Uint8Array(length));
}

export function concatenateBytes(...arrays) {
  const totalLength = arrays.reduce((total, array) => total + array.length, 0);

  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }

  return result;
}

export function createRequestID() {
  return Array.from(createRandomBytes(16))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}
