import { readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const dataDir = resolve(__dirname, "../public/data");

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string): Promise<string> =>
  new Promise((r) => rl.question(q, r));

function loadJson(file: string): Record<string, Record<string, unknown>> {
  return JSON.parse(readFileSync(resolve(dataDir, file), "utf-8"));
}

function saveJson(file: string, data: Record<string, unknown>): void {
  writeFileSync(resolve(dataDir, file), `${JSON.stringify(data, null, 2)}\n`);
}

async function addArchitect() {
  const data = loadJson("architects.json");
  const id = await ask("ID: ");

  if (data[id]) {
    console.log(`Erreur: l'architecte "${id}" existe deja.`);
    return;
  }

  const architect: Record<string, unknown> = {
    name: await ask("Nom: "),
    pseudo: await ask("Pseudo: "),
    email: await ask("Email: "),
    title: await ask("Titre: "),
    class: await ask("Classe: "),
    level: Number(await ask("Niveau: ")),
    avatar: await ask("Avatar (URL): "),
    skills: [] as { skillId: string; level: number }[],
    quote: await ask("Quote: "),
    lore: await ask("Lore: "),
  };

  const skills = loadJson("skills.json");
  const skillIds = Object.keys(skills);
  if (skillIds.length > 0) {
    const addSkills = await ask("Ajouter des skills ? (o/n): ");
    if (addSkills.toLowerCase() === "o") {
      console.log("Skills disponibles:");
      for (const sId of skillIds) {
        console.log(`  - ${sId} (${skills[sId]!.name}, max: ${skills[sId]!.maxLevel})`);
      }
      let more = true;
      while (more) {
        const skillId = await ask("  Skill ID: ");
        const level = Number(await ask("  Niveau: "));
        (architect.skills as { skillId: string; level: number }[]).push({ skillId, level });
        more = (await ask("  Autre skill ? (o/n): ")).toLowerCase() === "o";
      }
    }
  }

  data[id] = architect;
  saveJson("architects.json", data);
  console.log(`Architecte "${architect.name}" ajoute avec l'id "${id}".`);
}

async function addSkill() {
  const data = loadJson("skills.json");
  const id = await ask("ID: ");

  if (data[id]) {
    console.log(`Erreur: le Skill "${id}" existe deja.`);
    return;
  }

  const skill = {
    name: await ask("Nom: "),
    icon: await ask("Icone (emoji): "),
    color: await ask("Couleur (hex ou nom): "),
    maxLevel: Number(await ask("Niveau max: ")),
  };

  data[id] = skill;
  saveJson("skills.json", data);
  console.log(`Skill "${skill.name}" ajoute avec l'id "${id}".`);
}

async function addSigil() {
  const data = loadJson("sigils.json");
  const architects = loadJson("architects.json");
  const id = await ask("ID: ");

  if (data[id]) {
    console.log(`Erreur: le Sigil "${id}" existe deja.`);
    return;
  }

  const sigil: Record<string, unknown> = {
    name: await ask("Nom: "),
    description: await ask("Description: "),
    icon: await ask("Icone (emoji): "),
    rarity: await ask("Rarete (common/rare/epic/legendary): "),
    architectIds: [] as string[],
  };

  const architectIds = Object.keys(architects);
  if (architectIds.length > 0) {
    console.log("Architectes disponibles:");
    for (const aId of architectIds) {
      console.log(`  - ${aId} (${architects[aId]!.name})`);
    }
    const ids = await ask("Architect IDs (separes par des virgules, ou vide): ");
    if (ids.trim()) {
      sigil.architectIds = ids.split(",").map((s) => s.trim());
    }
  }

  data[id] = sigil;
  saveJson("sigils.json", data);
  console.log(`Sigil "${sigil.name}" ajoute avec l'id "${id}".`);
}

async function addSpark() {
  const data = loadJson("sparks.json");
  const id = await ask("ID: ");

  if (data[id]) {
    console.log(`Erreur: la Spark "${id}" existe deja.`);
    return;
  }

  const spark = {
    name: await ask("Nom: "),
    description: await ask("Description: "),
    status: await ask("Statut (idea/in-progress/done): "),
    tags: (await ask("Tags (separes par des virgules): "))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    authors: (await ask("Auteurs (separes par des virgules): "))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };

  data[id] = spark;
  saveJson("sparks.json", data);
  console.log(`Spark "${spark.name}" ajoutee avec l'id "${id}".`);
}

async function addImplant() {
  const data = loadJson("implants.json");
  const id = await ask("ID: ");

  if (data[id]) {
    console.log(`Erreur: l'implant "${id}" existe deja.`);
    return;
  }

  const implant = {
    name: await ask("Nom: "),
    description: await ask("Description: "),
    tags: (await ask("Tags (separes par des virgules): "))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    authors: (await ask("Auteurs (separes par des virgules): "))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };

  data[id] = implant;
  saveJson("implants.json", data);
  console.log(`Implant "${implant.name}" ajoute avec l'id "${id}".`);
}

const type = process.argv[2];
const handlers: Record<string, () => Promise<void>> = {
  architect: addArchitect,
  skill: addSkill,
  sigil: addSigil,
  spark: addSpark,
  implant: addImplant,
};

if (!type || !handlers[type]) {
  console.log("Usage: tsx scripts/add-data.ts <architect|skill|sigil|spark|implant>");
  rl.close();
  process.exit(1);
}

try {
  await handlers[type]();
} finally {
  rl.close();
}