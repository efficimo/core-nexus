export type { Cipher, WrappedPrivateKey } from "@efficimo/cipher";
export { AESVault, FileCipher, RSAKeyPair } from "@efficimo/cipher";

import { type AESVault, RSAKeyPair } from "@efficimo/cipher";

export interface UserEntry {
  kid: string;
  publicKey: JsonWebKey;
  salt: string;
  iv: string;
  encryptedPrivateKey: string;
  wrappedMasterKey: string;
}

export async function getVaultFromEntry(entry: UserEntry, password: string): Promise<AESVault> {
  const pair = await RSAKeyPair.fromPublicKey(entry.publicKey);
  await pair.unlockPrivateKey(
    { salt: entry.salt, iv: entry.iv, wrappedKey: entry.encryptedPrivateKey },
    password,
  );
  return pair.unwrapKey(entry.wrappedMasterKey);
}
