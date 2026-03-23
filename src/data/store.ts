import { decrypt } from "@/crypto";
import { LocalStorage } from "@/storage/LocalStorage";
import type { Architect } from "@/types/architect";
import type { Implant } from "@/types/implant";
import type { Sigil } from "@/types/sigil";
import type { Skill } from "@/types/skill";
import type { Spark } from "@/types/spark";

const jsonModules = import.meta.glob<Record<string, unknown>>(
  ["./**/*.json", "!./users.json"],
  { eager: true, import: "default" },
);

const encModules = import.meta.glob<string>("./**/*.json.enc", {
  eager: true,
  import: "default",
});

async function decryptData<T>(
  name: string,
  dataKey: string,
): Promise<Record<string, T>> {
  const jsonKey = `./${name}.json`;
  if (jsonModules[jsonKey]) {
    return jsonModules[jsonKey] as Record<string, T>;
  }

  const encKey = `./${name}.json.enc`;
  const raw = encModules[encKey];
  if (!raw) {
    return {} as Record<string, T>;
  }

  const json = await decrypt(raw, dataKey);
  return JSON.parse(json) as Record<string, T>;
}

class Store {
  private static instance: Store;

  architects: Record<string, Omit<Architect, "id">> = {};
  sigils: Record<string, Omit<Sigil, "id">> = {};
  skills: Record<string, Omit<Skill, "id">> = {};
  sparks: Record<string, Omit<Spark, "id">> = {};
  implants: Record<string, Omit<Implant, "id">> = {};

  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  get isLoaded(): boolean {
    return this.loadPromise !== null;
  }

  private async ensureLoaded(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    const dataKey = LocalStorage.get("#core-nexus/data-key");
    if (!dataKey) {
      throw new Error("No data key found in LocalStorage.");
    }

    this.loadPromise = this.load(dataKey);
    return this.loadPromise;
  }

  async load(dataKey: string): Promise<void> {
    const [architects, sigils, skills, sparks, implants] = await Promise.all([
      decryptData<Omit<Architect, "id">>("architects", dataKey),
      decryptData<Omit<Sigil, "id">>("sigils", dataKey),
      decryptData<Omit<Skill, "id">>("skills", dataKey),
      decryptData<Omit<Spark, "id">>("sparks", dataKey),
      decryptData<Omit<Implant, "id">>("implants", dataKey),
    ]);

    this.architects = architects;
    this.sigils = sigils;
    this.skills = skills;
    this.sparks = sparks;
    this.implants = implants;
  }

  async getArchitect(id: string): Promise<Architect | undefined> {
    await this.ensureLoaded();
    const data = this.architects[id];
    return data ? { id, ...data } : undefined;
  }

  async getArchitects(): Promise<Architect[]> {
    await this.ensureLoaded();
    return Object.entries(this.architects).map(([id, data]) => ({
      id,
      ...data,
    }));
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    await this.ensureLoaded();
    const data = this.skills[id];
    return data ? { id, ...data } : undefined;
  }

  async getSkills(): Promise<Skill[]> {
    await this.ensureLoaded();
    return Object.entries(this.skills).map(([id, data]) => ({ id, ...data }));
  }

  async getSigil(id: string): Promise<Sigil | undefined> {
    await this.ensureLoaded();
    const data = this.sigils[id];
    return data ? { id, ...data } : undefined;
  }

  async getSigils(): Promise<Sigil[]> {
    await this.ensureLoaded();
    return Object.entries(this.sigils).map(([id, data]) => ({ id, ...data }));
  }

  async getSpark(id: string): Promise<Spark | undefined> {
    await this.ensureLoaded();
    const data = this.sparks[id];
    return data ? { id, ...data } : undefined;
  }

  async getSparks(): Promise<Spark[]> {
    await this.ensureLoaded();
    return Object.entries(this.sparks).map(([id, data]) => ({ id, ...data }));
  }

  async getImplant(id: string): Promise<Implant | undefined> {
    await this.ensureLoaded();
    const data = this.implants[id];
    return data ? { id, ...data } : undefined;
  }

  async getImplants(): Promise<Implant[]> {
    await this.ensureLoaded();
    return Object.entries(this.implants).map(([id, data]) => ({
      id,
      ...data,
    }));
  }

  async getSkillsByArchitect(
    architectId: string,
  ): Promise<{ skill: Skill; level: number }[]> {
    await this.ensureLoaded();
    const architect = await this.getArchitect(architectId);
    if (!architect) return [];
    const results = await Promise.all(
      architect.skills.map(async (s) => {
        const skill = await this.getSkill(s.skillId);
        return skill ? { skill, level: s.level } : undefined;
      }),
    );
    return results.filter(
      (s): s is { skill: Skill; level: number } => s !== undefined,
    );
  }

  async getArchitectsBySkill(
    skillId: string,
  ): Promise<{ architect: Architect; level: number }[]> {
    await this.ensureLoaded();
    const architects = await this.getArchitects();
    return architects
      .map((a) => {
        const entry = a.skills.find((s) => s.skillId === skillId);
        return entry ? { architect: a, level: entry.level } : undefined;
      })
      .filter(
        (e): e is { architect: Architect; level: number } => e !== undefined,
      );
  }

  async getSigilsByArchitect(architectId: string): Promise<Sigil[]> {
    await this.ensureLoaded();
    const sigils = await this.getSigils();
    return sigils.filter((s) => s.architectIds.includes(architectId));
  }

  async getArchitectsBySigil(sigilId: string): Promise<Architect[]> {
    await this.ensureLoaded();
    const sigil = await this.getSigil(sigilId);
    if (!sigil) return [];
    const results = await Promise.all(
      sigil.architectIds.map((id) => this.getArchitect(id)),
    );
    return results.filter((a): a is Architect => a !== undefined);
  }
}

export const store = Store.getInstance();
