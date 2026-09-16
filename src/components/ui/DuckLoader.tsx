import { cx } from "@core-nexus/utils/cx";
import type { CSSProperties, ReactElement } from "react";
import { DUCK_OUTLINE, DUCK_PIXELS, DUCK_VIEWBOX } from "./icons/duckPaths";

export type DuckLoaderVariant = "scan" | "boot" | "glitch";

type Props = {
  /**
   * `scan` : une vague traverse le cerveau — chargement generique.
   * `boot` : les pixels s'allument un a un et restent allumes — sequence de
   *          demarrage, dechiffrement, login.
   * `glitch` : le cerveau vire au rouge par a-coups — etat d'erreur.
   */
  variant?: DuckLoaderVariant;
  /**
   * Cote en pixels. Minimum 28 : contrairement au logo statique, un loader ne
   * peut pas masquer le motif de tete puisque c'est lui qui porte l'animation.
   */
  size?: number;
  /** Texte lu par les lecteurs d'ecran. */
  label?: string;
  className?: string;
};

const MIN_SIZE = 28;

const VARIANT_CLS: Record<DuckLoaderVariant, string> = {
  scan: "duck-scan",
  boot: "duck-boot",
  glitch: "duck-glitch",
};

/**
 * Loader anime a partir du logo : les onze carres du motif de tete forment le
 * « cerveau » et portent l'animation.
 *
 * Les paths sont rendus en ligne plutot que reference via `<use>` : une
 * animation CSS ne traverse pas le shadow DOM d'un `<use>`, seules les
 * proprietes heritees le font.
 */
export function DuckLoader({
  variant = "scan",
  size = 48,
  label = "Chargement",
  className,
}: Props): ReactElement {
  return (
    <svg
      viewBox={DUCK_VIEWBOX}
      width={Math.max(size, MIN_SIZE)}
      height={Math.max(size, MIN_SIZE)}
      fill="none"
      role="img"
      aria-label={label}
      className={cx("text-lime [--logo-accent:var(--accent)]", VARIANT_CLS[variant], className)}
    >
      <path
        d={DUCK_OUTLINE.d}
        transform={DUCK_OUTLINE.t}
        fill="currentColor"
        className="duck-outline"
      />
      <g fill="var(--logo-accent)">
        {/* Cle sur le transform : plusieurs carres du motif partagent le meme
            `d`, seule leur translation les distingue. */}
        {DUCK_PIXELS.map((p, i) => (
          <path
            key={p.t}
            d={p.d}
            transform={p.t}
            className="duck-px"
            style={{ "--i": i } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}
