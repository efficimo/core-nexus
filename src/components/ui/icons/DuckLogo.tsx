import { cx } from "@core-nexus/utils/cx";
import type { ReactElement, SVGProps } from "react";
import { DUCK_FEET, DUCK_OUTLINE, DUCK_PIXELS, DUCK_VIEWBOX } from "./duckPaths";

type Props = Omit<SVGProps<SVGSVGElement>, "viewBox"> & {
  /** Cote en pixels. Sous 32, le motif de tete est masque (voir plus bas). */
  size?: number;
  /**
   * Masque le motif pixel de la tete. Par defaut, il l'est automatiquement
   * sous 32px : a cette taille les onze carres s'empatent en une tache.
   */
  hidePixels?: boolean;
};

/**
 * Logo Core Nexus.
 *
 * Le contour prend `currentColor` (lime par defaut via la classe), le motif de
 * tete et les pattes prennent `--logo-accent`. Colorer le logo revient donc a
 * poser une couleur de texte et cette variable.
 */
export function DuckLogo({ size = 32, hidePixels, className, ...rest }: Props): ReactElement {
  const withoutPixels = hidePixels ?? size < 32;

  return (
    <svg
      viewBox={DUCK_VIEWBOX}
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="Core Nexus"
      className={cx("text-lime [--logo-accent:var(--accent)]", className)}
      {...rest}
    >
      <path d={DUCK_OUTLINE.d} transform={DUCK_OUTLINE.t} fill="currentColor" />
      <g fill="var(--logo-accent)">
        {DUCK_FEET.map((p) => (
          <path key={p.t} d={p.d} transform={p.t} />
        ))}
      </g>
      {!withoutPixels && (
        <g fill="var(--logo-accent)">
          {/* Cle sur le transform : plusieurs carres du motif partagent le meme
              `d`, seule leur translation les distingue. */}
          {DUCK_PIXELS.map((p) => (
            <path key={p.t} d={p.d} transform={p.t} />
          ))}
        </g>
      )}
    </svg>
  );
}
