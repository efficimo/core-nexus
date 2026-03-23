import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { encrypt, decrypt } from "../src/crypto";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");
const dataDir = resolve(rootDir, "src/data");
const dataKeyFile = resolve(rootDir, ".datakey.local");

function loadDataKey(): string {
  try {
    return readFileSync(dataKeyFile, "utf-8").trim();
  } catch {
    console.error("Erreur: fichier .datakey.local introuvable.");
    console.error('Creez-le avec votre data key: echo "MA_CLEF" > .datakey.local');
    process.exit(1);
  }
}

function findEncryptedFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findEncryptedFiles(full));
    } else if (entry.name.endsWith(".json.enc")) {
      results.push(full);
    }
  }
  return results;
}

function toDecryptedPath(encFile: string): string {
  return encFile.replace(/\.json\.enc$/, ".json");
}

function label(filePath: string): string {
  return relative(dataDir, filePath);
}

async function decryptAll() {
  const dataKey = loadDataKey();
  const encFiles = findEncryptedFiles(dataDir);
  let count = 0;

  for (const encFile of encFiles) {
    const decFile = toDecryptedPath(encFile);
    const name = label(encFile);
    const content = readFileSync(encFile, "utf-8").trim();

    try {
      const json = await decrypt(content, dataKey);
      JSON.parse(json);
      writeFileSync(decFile, `${json}\n`);
      console.log(`  ${name}`);
      count++;
    } catch {
      console.error(`  erreur: ${name} (clef incorrecte ou donnees corrompues)`);
    }
  }

  console.log(`\n${count} fichier(s) dechiffre(s).`);
}

async function encryptAll() {
  const dataKey = loadDataKey();
  const encFiles = findEncryptedFiles(dataDir);
  let count = 0;

  for (const encFile of encFiles) {
    const decFile = toDecryptedPath(encFile);
    const name = label(decFile);

    if (!existsSync(decFile)) {
      console.log(`  skip: ${name} (introuvable)`);
      continue;
    }

    const content = readFileSync(decFile, "utf-8").trim();
    try {
      JSON.parse(content);
    } catch {
      console.error(`  erreur: ${name} (JSON invalide)`);
      continue;
    }

    const encrypted = await encrypt(content, dataKey);
    writeFileSync(encFile, `${encrypted}\n`);
    console.log(`  ${label(encFile)}`);
    count++;
  }

  console.log(`\n${count} fichier(s) chiffre(s).`);
}

async function verifyAll() {
  const dataKey = loadDataKey();
  const encFiles = findEncryptedFiles(dataDir);
  let ok = 0;
  let fail = 0;

  for (const encFile of encFiles) {
    const decFile = toDecryptedPath(encFile);
    const name = label(encFile).replace(/\.enc$/, "");

    if (!existsSync(decFile)) {
      console.log(`  skip: ${name} (introuvable, lancez data:decrypt)`);
      continue;
    }

    const decContent = readFileSync(decFile, "utf-8").trim();
    const encContent = readFileSync(encFile, "utf-8").trim();

    try {
      const decrypted = await decrypt(encContent, dataKey);
      const decJson = JSON.stringify(JSON.parse(decContent));
      const encJson = JSON.stringify(JSON.parse(decrypted));

      if (decJson === encJson) {
        console.log(`  ok: ${name}`);
        ok++;
      } else {
        console.error(`  DESYNC: ${name} (le .json ne correspond pas au .json.enc)`);
        fail++;
      }
    } catch {
      console.error(`  ERREUR: ${name} (impossible de dechiffrer le .json.enc)`);
      fail++;
    }
  }

  console.log(`\n${ok} ok, ${fail} erreur(s).`);
  if (fail > 0) {
    console.error("\nLancez 'npm run data:encrypt' pour synchroniser.");
    process.exit(1);
  }
}

const command = process.argv[2];
const handlers: Record<string, () => Promise<void>> = {
  decrypt: decryptAll,
  encrypt: encryptAll,
  verify: verifyAll,
};

if (!command || !handlers[command]) {
  console.log("Usage: tsx scripts/data-crypto.ts <decrypt|encrypt|verify>");
  process.exit(1);
}

await handlers[command]();