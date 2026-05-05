import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { AESVault, FileCipher, RSAKeyPair } from "@efficimo/cipher";
import type { UserEntry } from "../src/user-vault";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");
const dataDir = resolve(rootDir, "public/data");
const dataKeyFile = resolve(rootDir, ".datakey.local");
const usersFile = resolve(rootDir, "public/data/users.json");
const masterPubFile = resolve(rootDir, "public/data/master.pub.json");

// Délai minimal avant suppression d'un kid orphelin (en jours)
const CLEAN_DELAY_DAYS = 90;

type NexusKeyEntry = { key: string; created: string };

function generateKid(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function findEncryptedFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) results.push(...findEncryptedFiles(full));
    else if (entry.name.endsWith(".json.enc")) results.push(full);
  }
  return results;
}

function label(filePath: string): string {
  return relative(dataDir, filePath);
}

function loadUsers(): Record<string, UserEntry> {
  if (!existsSync(usersFile)) return {};
  return JSON.parse(readFileSync(usersFile, "utf-8"));
}

function saveUsers(data: Record<string, UserEntry>): void {
  writeFileSync(usersFile, `${JSON.stringify(data, null, 2)}\n`);
}

function loadMasterPub(): { kid: string; created: string } | null {
  if (!existsSync(masterPubFile)) return null;
  return JSON.parse(readFileSync(masterPubFile, "utf-8"));
}

function saveMasterPub(kid: string): void {
  writeFileSync(
    masterPubFile,
    `${JSON.stringify({ kid, created: new Date().toISOString() }, null, 2)}\n`,
  );
}

function getNexusKeys(): Record<string, NexusKeyEntry> {
  let raw: string | undefined;

  if (process.env.NEXUS_KEYS) {
    raw = process.env.NEXUS_KEYS;
  } else {
    try {
      const repo = execSync("gh repo view --json nameWithOwner -q .nameWithOwner", {
        encoding: "utf-8",
      }).trim();
      const result = execSync(`gh api repos/${repo}/actions/variables/NEXUS_KEYS`, {
        encoding: "utf-8",
      }).trim();
      raw = (JSON.parse(result) as { value: string }).value;
    } catch {
      return {};
    }
  }

  return JSON.parse(raw) as Record<string, NexusKeyEntry>;
}

function setNexusKeys(keys: Record<string, NexusKeyEntry>): void {
  const json = JSON.stringify(keys);
  execSync(`gh variable set NEXUS_KEYS --body '${json.replace(/'/g, "'\\''")}'`);
}

// Recupere la master key depuis GitHub variable pour le kid actif
async function init() {
  const pub = loadMasterPub();
  if (!pub) {
    console.error("Erreur : master.pub.json introuvable.");
    console.error("Lancez d'abord : npm run key:rotate");
    process.exit(1);
  }

  console.log(`kid actif : ${pub.kid}`);
  console.log("Recuperation de NEXUS_KEYS depuis GitHub...");

  const keys = getNexusKeys();
  const entry = keys[pub.kid];

  if (!entry) {
    console.error(`Erreur : kid "${pub.kid}" introuvable dans NEXUS_KEYS.`);
    console.error("Vérifiez que npm run key:publish a été exécuté après la dernière rotation.");
    process.exit(1);
  }

  writeFileSync(dataKeyFile, `${entry.key}\n`);
  console.log(`Master key (kid=${pub.kid}) sauvegardée dans .datakey.local`);
}

// Genere un nouveau kid + cle, re-chiffre tout, met a jour users.json et master.pub.json
async function rotate() {
  const encFiles = findEncryptedFiles(dataDir);
  let oldKey: AESVault | null = null;

  if (existsSync(dataKeyFile)) {
    oldKey = await AESVault.import(readFileSync(dataKeyFile, "utf-8").trim());
  } else if (encFiles.length > 0) {
    console.error("Erreur : .datakey.local introuvable mais des fichiers chiffres existent.");
    console.error("Lancez d'abord : npm run key:init");
    process.exit(1);
  }

  // Dechiffrer tous les fichiers en memoire avec l'ancienne cle
  const decrypted = new Map<string, string>();
  if (oldKey && encFiles.length > 0) {
    const oldFile = FileCipher.from(oldKey);
    console.log(`\nDechiffrement de ${encFiles.length} fichier(s)...`);
    for (const file of encFiles) {
      try {
        const content = readFileSync(file, "utf-8").trim();
        decrypted.set(file, await oldFile.decrypt(content));
        console.log(`  ok : ${label(file)}`);
      } catch {
        console.error(`  erreur : ${label(file)} — ignore`);
      }
    }
  }

  // Generer le nouveau kid et la nouvelle master key
  const newKid = generateKid();
  const newVault = await AESVault.generate();
  const newFile = FileCipher.from(newVault);

  // Re-chiffrer tous les fichiers
  if (decrypted.size > 0) {
    console.log("\nRe-chiffrement avec la nouvelle cle...");
    for (const [file, content] of decrypted) {
      writeFileSync(file, `${await newFile.encrypt(content)}\n`);
      console.log(`  ok : ${label(file)}`);
    }
  }

  // Mettre a jour les entrees utilisateurs
  const users = loadUsers();
  const emails = Object.keys(users);
  if (emails.length > 0) {
    console.log(`\nMise a jour de ${emails.length} entree(s) utilisateur...`);
    for (const email of emails) {
      try {
        const entry = users[email]!;
        const pair = await RSAKeyPair.fromPublicKey(entry.publicKey);
        users[email] = {
          ...entry,
          kid: newKid,
          wrappedMasterKey: await pair.wrapKey(newVault),
        };
        console.log(`  ok : ${email}`);
      } catch {
        console.error(`  erreur : ${email} — entree inchangee`);
      }
    }
    saveUsers(users);
  }

  // Sauvegarder la nouvelle cle localement et mettre a jour master.pub.json
  writeFileSync(dataKeyFile, `${await newVault.export()}\n`);
  saveMasterPub(newKid);

  console.log(`\nRotation terminee. kid=${newKid}`);
  console.log("Etapes suivantes :");
  console.log("  1. git add public/data/ && git commit && git push");
  console.log("  2. npm run key:publish   — publier la nouvelle cle sur GitHub");
  console.log("  3. npm run key:clean     — (optionnel) nettoyer les anciens kids");
}

// Publie la cle du kid actif dans NEXUS_KEYS sur GitHub
async function publish() {
  if (!existsSync(dataKeyFile)) {
    console.error("Erreur : .datakey.local introuvable.");
    process.exit(1);
  }
  const pub = loadMasterPub();
  if (!pub) {
    console.error("Erreur : master.pub.json introuvable.");
    process.exit(1);
  }

  const newKeyBase64 = readFileSync(dataKeyFile, "utf-8").trim();
  console.log(`Publication de kid=${pub.kid} dans NEXUS_KEYS...`);

  const keys = getNexusKeys();
  keys[pub.kid] = { key: newKeyBase64, created: pub.created };
  setNexusKeys(keys);

  console.log(`kid=${pub.kid} publié. Total : ${Object.keys(keys).length} kid(s) dans NEXUS_KEYS.`);
}

// Retire les kids orphelins de NEXUS_KEYS uniquement s'ils sont plus vieux que CLEAN_DELAY_DAYS
async function clean() {
  console.log("Lecture de master.pub.json sur toutes les branches...");

  const referencedKids = new Set<string>();

  let branches: string[];
  try {
    branches = execSync(
      "git for-each-ref --format='%(refname:short)' refs/heads/ refs/remotes/",
      { encoding: "utf-8" },
    )
      .trim()
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);
  } catch {
    console.error("Erreur : impossible de lister les branches git.");
    process.exit(1);
  }

  for (const branch of branches) {
    try {
      const raw = execSync(`git show "${branch}:public/data/master.pub.json"`, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      const { kid } = JSON.parse(raw);
      if (kid) {
        referencedKids.add(kid);
        console.log(`  ${branch} → kid=${kid}`);
      }
    } catch {
      // master.pub.json absent sur cette branche — normal
    }
  }

  // Inclure aussi le fichier local (HEAD non commité ou CI avant push)
  const localPub = loadMasterPub();
  if (localPub?.kid) {
    referencedKids.add(localPub.kid);
  }

  if (referencedKids.size === 0) {
    console.error("Aucun kid trouvé dans aucune branche — abandon par sécurité.");
    process.exit(1);
  }

  console.log(`\nKids actifs : ${[...referencedKids].join(", ")}`);
  console.log("Recuperation de NEXUS_KEYS depuis GitHub...");

  const keys = getNexusKeys();
  const before = Object.keys(keys).length;
  const now = Date.now();
  const delayMs = CLEAN_DELAY_DAYS * 24 * 60 * 60 * 1000;

  const deleted: string[] = [];
  const tooRecent: string[] = [];

  for (const [kid, entry] of Object.entries(keys)) {
    if (referencedKids.has(kid)) continue;

    const age = now - new Date(entry.created).getTime();
    if (age >= delayMs) {
      deleted.push(kid);
      delete keys[kid];
    } else {
      const daysLeft = Math.ceil((delayMs - age) / (24 * 60 * 60 * 1000));
      tooRecent.push(`${kid} (suppression dans ${daysLeft}j)`);
    }
  }

  if (deleted.length === 0 && tooRecent.length === 0) {
    console.log("Aucun kid orphelin — rien a faire.");
    return;
  }

  if (tooRecent.length > 0) {
    console.log(`\nKids orphelins conservés (< ${CLEAN_DELAY_DAYS}j) : ${tooRecent.join(", ")}`);
  }

  if (deleted.length > 0) {
    setNexusKeys(keys);
    console.log(`\nSupprime ${deleted.length} kid(s) : ${deleted.join(", ")}`);
    console.log(`NEXUS_KEYS : ${before} → ${Object.keys(keys).length} kid(s)`);
  } else {
    console.log("\nAucun kid suffisamment ancien pour être supprimé.");
  }
}

const command = process.argv[2];
const handlers: Record<string, () => Promise<void>> = {
  init,
  rotate,
  publish,
  clean,
};

if (!command || !handlers[command]) {
  console.log("Usage: tsx scripts/rotate-key.ts <init|rotate|publish|clean>");
  process.exit(1);
}

await handlers[command]!();