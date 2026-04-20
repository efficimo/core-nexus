const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const PBKDF2_ITERATIONS = 100_000;

async function deriveKey(password: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encrypt(plaintext: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const key = await deriveKey(password, salt.buffer as ArrayBuffer);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext)),
  );

  const result = new Uint8Array(SALT_LENGTH + IV_LENGTH + ciphertext.length);
  result.set(salt, 0);
  result.set(iv, SALT_LENGTH);
  result.set(ciphertext, SALT_LENGTH + IV_LENGTH);

  return btoa(String.fromCharCode.apply(null, Array.from(result)));
}

export async function decrypt(base64Data: string, password: string): Promise<string> {
  const binary = atob(base64Data);
  const data = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    data[i] = binary.charCodeAt(i);
  }

  const salt = data.slice(0, SALT_LENGTH);
  const iv = data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = data.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(password, salt.buffer as ArrayBuffer);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);

  return new TextDecoder().decode(plaintext);
}

export interface UserEntry {
  email: string;
  dataKey: string;
}

export async function decryptUserEntry(
  encryptedValue: string,
  email: string,
  password: string,
): Promise<UserEntry> {
  const json = await decrypt(encryptedValue, password);
  const entry: UserEntry = JSON.parse(json);

  if (entry.email !== email) {
    throw new Error("Decryption integrity check failed");
  }

  return entry;
}
