import { readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { encrypt, decrypt } from "../src/crypto";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");
const usersFile = resolve(rootDir, "src/data/users.json");
const dataKeyFile = resolve(rootDir, ".datakey.local");

function loadDataKey(): string {
  try {
    return readFileSync(dataKeyFile, "utf-8").trim();
  } catch {
    console.error(`Erreur: fichier ${dataKeyFile} introuvable.`);
    console.error('Creez-le avec votre data key: echo "MA_CLEF" > .datakey.local');
    process.exit(1);
  }
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string): Promise<string> =>
  new Promise((r) => rl.question(q, r));

function loadUsers(): Record<string, string> {
  return JSON.parse(readFileSync(usersFile, "utf-8"));
}

function saveUsers(data: Record<string, string>): void {
  writeFileSync(usersFile, `${JSON.stringify(data, null, 2)}\n`);
}

async function addUser() {
  const users = loadUsers();

  const email = await ask("Email: ");
  if (users[email]) {
    console.log(`Erreur: l'utilisateur "${email}" existe deja.`);
    return;
  }

  const password = await ask("Mot de passe personnel: ");
  const dataKey = loadDataKey();

  const entry = { email, dataKey };
  const encrypted = await encrypt(JSON.stringify(entry), password);

  users[email] = encrypted;
  saveUsers(users);
  console.log(`Utilisateur "${email}" ajoute au registre.`);
}

async function verifyUser() {
  const users = loadUsers();

  const email = await ask("Email: ");
  if (!users[email]) {
    console.log(`Erreur: l'utilisateur "${email}" n'existe pas.`);
    return;
  }

  const password = await ask("Mot de passe: ");
  try {
    const json = await decrypt(users[email]!, password);
    const entry = JSON.parse(json);

    if (entry.email !== email) {
      console.log("Erreur: l'email dechiffre ne correspond pas a la clef.");
      return;
    }

    console.log("Verification reussie!");
    console.log("  Email:", entry.email);
    console.log("  Data key:", entry.dataKey);
  } catch {
    console.log("Erreur: mot de passe incorrect ou donnees corrompues.");
  }
}

const command = process.argv[2];
const handlers: Record<string, () => Promise<void>> = {
  add: addUser,
  verify: verifyUser,
};

if (!command || !handlers[command]) {
  console.log("Usage: tsx scripts/add-user.ts <add|verify>");
  rl.close();
  process.exit(1);
}

try {
  await handlers[command]();
} finally {
  rl.close();
}