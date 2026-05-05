import { type Architect, architectsRecordSchema } from "@core-nexus/types/architect";
import { type Implant, implantsRecordSchema } from "@core-nexus/types/implant";
import { type Sigil, sigilsRecordSchema } from "@core-nexus/types/sigil";
import { type Skill, skillsRecordSchema } from "@core-nexus/types/skill";
import { type Spark, sparksRecordSchema } from "@core-nexus/types/spark";
import { AESVault, FileCipher } from "@core-nexus/user-vault";
import { LocalStorage } from "@efficimo/storage";
import { queryOptions } from "@tanstack/react-query";
import type { z } from "zod";

const BASE_URL = `${import.meta.env.BASE_URL}data`;

async function fetchData<T>(name: string, schema: z.ZodType<T>): Promise<T> {
  const dataKey = LocalStorage.get("#core-nexus/data-key");
  if (!dataKey) throw new Error("No data key found in LocalStorage.");

  const jsonRes = await fetch(`${BASE_URL}/${name}.json`);
  if (jsonRes.ok && jsonRes.headers.get("content-type")?.includes("application/json")) {
    return schema.parse(await jsonRes.json());
  }

  const encRes = await fetch(`${BASE_URL}/${name}.json.enc`);
  if (!encRes.ok) return schema.parse({});

  const vault = await AESVault.import(dataKey);
  const json = await FileCipher.from(vault).decrypt((await encRes.text()).trim());
  return schema.parse(JSON.parse(json));
}

function recordToList<T>(
  record: Record<string, Omit<T, "id">>,
): (Omit<T, "id"> & { id: string })[] {
  return Object.entries(record).map(([id, data]) => ({ id, ...data }));
}

function pickFromRecord<T>(
  record: Record<string, Omit<T, "id">>,
  id: string,
): (Omit<T, "id"> & { id: string }) | undefined {
  const entry = record[id];
  return entry ? { id, ...entry } : undefined;
}

const STALE_TIME = 10 * 60 * 1000;

const baseQueries = {
  architects: () =>
    queryOptions({
      queryKey: ["architects"] as const,
      queryFn: () => fetchData("architects", architectsRecordSchema),
      staleTime: STALE_TIME,
    }),
  skills: () =>
    queryOptions({
      queryKey: ["skills"] as const,
      queryFn: () => fetchData("skills", skillsRecordSchema),
      staleTime: STALE_TIME,
    }),
  sigils: () =>
    queryOptions({
      queryKey: ["sigils"] as const,
      queryFn: () => fetchData("sigils", sigilsRecordSchema),
      staleTime: STALE_TIME,
    }),
  sparks: () =>
    queryOptions({
      queryKey: ["sparks"] as const,
      queryFn: () => fetchData("sparks", sparksRecordSchema),
      staleTime: STALE_TIME,
    }),
  implants: () =>
    queryOptions({
      queryKey: ["implants"] as const,
      queryFn: () => fetchData("implants", implantsRecordSchema),
      staleTime: STALE_TIME,
    }),
};

export const architectsQueryOptions = () =>
  queryOptions({
    ...baseQueries.architects(),
    select: (data) => recordToList<Architect>(data),
  });

export const architectQueryOptions = (id: string) =>
  queryOptions({
    ...baseQueries.architects(),
    select: (data) => pickFromRecord<Architect>(data, id),
  });

export const skillsQueryOptions = () =>
  queryOptions({
    ...baseQueries.skills(),
    select: (data) => recordToList<Skill>(data),
  });

export const sigilsQueryOptions = () =>
  queryOptions({
    ...baseQueries.sigils(),
    select: (data) => recordToList<Sigil>(data),
  });

export const sigilsByArchitectQueryOptions = (architectId: string) =>
  queryOptions({
    ...baseQueries.sigils(),
    select: (data) => recordToList<Sigil>(data).filter((s) => s.architectIds.includes(architectId)),
  });

export const sparksQueryOptions = () =>
  queryOptions({
    ...baseQueries.sparks(),
    select: (data) => recordToList<Spark>(data),
  });

export const sparkQueryOptions = (id: string) =>
  queryOptions({
    ...baseQueries.sparks(),
    select: (data) => pickFromRecord<Spark>(data, id),
  });

export const implantsQueryOptions = () =>
  queryOptions({
    ...baseQueries.implants(),
    select: (data) => recordToList<Implant>(data),
  });

export const implantQueryOptions = (id: string) =>
  queryOptions({
    ...baseQueries.implants(),
    select: (data) => pickFromRecord<Implant>(data, id),
  });
