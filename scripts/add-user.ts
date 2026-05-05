import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { AESVault, RSAKeyPair } from "@efficimo/cipher";
import type { UserEntry } from "../src/user-vault";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");
const usersFile = resolve(rootDir, "public/data/users.json");
const dataKeyFile = resolve(rootDir, ".datakey.local");
const masterPubFile = resolve(rootDir, "public/data/master.pub.json");

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string): Promise<string> => new Promise((r) => rl.question(q, r));

function loadMasterKeyBase64(): string {
  if (!existsSync(dataKeyFile)) {
    console.error(`Erreur : ${dataKeyFile} introuvable.`);
    console.error("Lancez d'abord : npm run key:init");
    process.exit(1);
  }
  return readFileSync(dataKeyFile, "utf-8").trim();
}

function loadCurrentKid(): string {
  if (!existsSync(masterPubFile)) {
    console.error("Erreur : master.pub.json introuvable.");
    console.error("Lancez d'abord : npm run key:rotate");
    process.exit(1);
  }
  return JSON.parse(readFileSync(masterPubFile, "utf-8")).kid as string;
}

function loadUsers(): Record<string, UserEntry> {
  if (!existsSync(usersFile)) return {};
  return JSON.parse(readFileSync(usersFile, "utf-8"));
}

function saveUsers(data: Record<string, UserEntry>): void {
  writeFileSync(usersFile, `${JSON.stringify(data, null, 2)}\n`);
}

async function add() {
  const users = loadUsers();
  const email = await ask("Email : ");

  if (users[email]) {
    console.error(`Erreur : "${email}" existe deja. Utilisez change-password pour modifier.`);
    return;
  }

  const password = await ask("Mot de passe : ");
  const masterVault = await AESVault.import(loadMasterKeyBase64());
  const kid = loadCurrentKid();

  const pair = await RSAKeyPair.generate();
  const { salt, iv, wrappedKey: encryptedPrivateKey } = await pair.lockPrivateKey(password);
  const wrappedMasterKey = await pair.wrapKey(masterVault);

  users[email] = {
    kid,
    publicKey: pair.publicKey,
    salt,
    iv,
    encryptedPrivateKey,
    wrappedMasterKey,
  };
  saveUsers(users);
  console.log(`Utilisateur "${email}" ajoute.`);
}

async function remove() {
  const users = loadUsers();
  const email = await ask("Email : ");

  if (!users[email]) {
    console.error(`Erreur : "${email}" introuvable.`);
    return;
  }

  const confirm = await ask(`Supprimer "${email}" ? (oui/non) : `);
  if (confirm.trim().toLowerCase() !== "oui") {
    console.log("Annule.");
    return;
  }

  delete users[email];
  saveUsers(users);
  console.log(`Utilisateur "${email}" supprime.`);
}

async function changePassword() {
  const users = loadUsers();
  const email = await ask("Email : ");

  if (!users[email]) {
    console.error(`Erreur : "${email}" introuvable.`);
    return;
  }

  const entry = users[email]!;
  const oldPassword = await ask("Ancien mot de passe : ");

  const pair = await RSAKeyPair.fromPublicKey(entry.publicKey);
  // extractable: true — necessaire pour re-wrapper la cle privee avec le nouveau mot de passe
  await pair.unlockPrivateKey(
    { salt: entry.salt, iv: entry.iv, wrappedKey: entry.encryptedPrivateKey },
    oldPassword,
    true,
  );

  const newPassword = await ask("Nouveau mot de passe : ");
  const { salt, iv, wrappedKey: encryptedPrivateKey } = await pair.lockPrivateKey(newPassword);

  // wrappedMasterKey inchange : il depend de la cle publique RSA, pas du mot de passe
  users[email] = { ...entry, salt, iv, encryptedPrivateKey };
  saveUsers(users);
  console.log(`Mot de passe de "${email}" mis a jour.`);
}

async function verify() {
  const users = loadUsers();
  const email = await ask("Email : ");

  if (!users[email]) {
    console.error(`Erreur : "${email}" introuvable.`);
    return;
  }

  const entry = users[email]!;
  const password = await ask("Mot de passe : ");

  try {
    const pair = await RSAKeyPair.fromPublicKey(entry.publicKey);
    await pair.unlockPrivateKey(
      { salt: entry.salt, iv: entry.iv, wrappedKey: entry.encryptedPrivateKey },
      password,
    );
    const vault = await pair.unwrapKey(entry.wrappedMasterKey);
    console.log("Verification reussie.");
    console.log(`  Master key : ${await vault.export()}`);
  } catch {
    console.error("Echec : mot de passe incorrect.");
  }
}

const command = process.argv[2];
const handlers: Record<string, () => Promise<void>> = {
  add,
  remove,
  verify,
  "change-password": changePassword,
};

if (!command || !handlers[command]) {
  console.log("Usage: tsx scripts/add-user.ts <add|remove|verify|change-password>");
  rl.close();
  process.exit(1);
}

try {
  await handlers[command]!();
} finally {
  rl.close();
}