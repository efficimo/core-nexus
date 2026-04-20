import type { Sigil } from "@/types/sigil";

export const rarityVariant = {
  common: "default",
  rare: "accent",
  epic: "purple",
  legendary: "warn",
} as const satisfies Record<Sigil["rarity"], "default" | "accent" | "purple" | "warn">;
