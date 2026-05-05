import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { AESVault, FileCipher } from "@efficimo/cipher";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");
const dataDir = resolve(rootDir, "public/data");
const dataKeyFile = resolve(rootDir, ".datakey.local");

async function loadVault(): Promise<{ vault: AESVault; file: FileCipher }> {
  if (!existsSync(dataKeyFile)) {
    console.error("Erreur : .datakey.local introuvable.");
    console.error("Lancez d'abord : npm run key:init");
    process.exit(1);
  }
  const vault = await AESVault.import(readFileSync(dataKeyFile, "utf-8").trim());
  return { vault, file: FileCipher.from(vault) };
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

function toDecryptedPath(encFile: string): string {
  return encFile.replace(/\.json\.enc$/, ".json");
}

function label(filePath: string): string {
  return relative(dataDir, filePath);
}

async function decryptAll() {
  const { file } = await loadVault();
  const encFiles = findEncryptedFiles(dataDir);
  let count = 0;

  for (const encFile of encFiles) {
    const decFile = toDecryptedPath(encFile);
    const content = readFileSync(encFile, "utf-8").trim();

    try {
      const json = await file.decrypt(content);
      JSON.parse(json);
      writeFileSync(decFile, `${json}\n`);
      console.log(`  ${label(encFile)}`);
      count++;
    } catch {
      console.error(`  erreur : ${label(encFile)} (cle incorrecte ou donnees corrompues)`);
    }
  }

  console.log(`\n${count} fichier(s) dechiffre(s).`);
}

async function encryptAll() {
  const { file } = await loadVault();
  const encFiles = findEncryptedFiles(dataDir);
  let count = 0;

  for (const encFile of encFiles) {
    const decFile = toDecryptedPath(encFile);

    if (!existsSync(decFile)) {
      console.log(`  skip : ${label(decFile)} (introuvable)`);
      continue;
    }

    const content = readFileSync(decFile, "utf-8").trim();
    try {
      JSON.parse(content);
    } catch {
      console.error(`  erreur : ${label(decFile)} (JSON invalide)`);
      continue;
    }

    writeFileSync(encFile, `${await file.encrypt(content)}\n`);
    console.log(`  ${label(encFile)}`);
    count++;
  }

  console.log(`\n${count} fichier(s) chiffre(s).`);
}

async function verifyAll() {
  const { file } = await loadVault();
  const encFiles = findEncryptedFiles(dataDir);
  let ok = 0;
  let fail = 0;

  for (const encFile of encFiles) {
    const decFile = toDecryptedPath(encFile);
    const name = label(encFile).replace(/\.enc$/, "");

    if (!existsSync(decFile)) {
      console.log(`  skip : ${name} (lancez data:decrypt d'abord)`);
      continue;
    }

    const decContent = readFileSync(decFile, "utf-8").trim();
    const encContent = readFileSync(encFile, "utf-8").trim();

    try {
      const decrypted = await file.decrypt(encContent);
      if (JSON.stringify(JSON.parse(decContent)) === JSON.stringify(JSON.parse(decrypted))) {
        console.log(`  ok : ${name}`);
        ok++;
      } else {
        console.error(`  DESYNC : ${name}`);
        fail++;
      }
    } catch {
      console.error(`  ERREUR : ${name} (impossible de dechiffrer)`);
      fail++;
    }
  }

  console.log(`\n${ok} ok, ${fail} erreur(s).`);
  if (fail > 0) {
    console.error("Lancez 'npm run data:encrypt' pour synchroniser.");
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

await handlers[command]!();