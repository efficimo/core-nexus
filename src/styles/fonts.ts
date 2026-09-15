import pressStart2p from "@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2";
import vt323 from "@fontsource/vt323/files/vt323-latin-400-normal.woff2";

/**
 * Enregistre les deux polices de l'interface.
 *
 * Elles sont declarees par la FontFace API plutot que par des `@font-face`
 * CSS : Tailwind 4 inline les `@import` sans rebaser les `url()`, et Vite ne
 * reecrit pas non plus celles d'une feuille qu'il injecte en ligne — la woff2
 * finissait demandee a une URL que le serveur resout en `index.html`, la
 * police echouant alors en silence. Un import JS, lui, passe par le pipeline
 * d'assets : l'URL est correcte en dev comme en production, `base` compris.
 *
 * `sizeAdjust` ramene les deux polices sur la metrique de l'ancien duo
 * Orbitron / Share Tech Mono : a taille egale Press Start 2P dessine environ
 * 60 % plus large et VT323 40 % plus etroit. Les tailles codees en dur dans
 * les composants (`text-[0.5rem]`, …) restent donc valables.
 */
declare global {
  /* `size-adjust` est implemente par les navigateurs depuis 2021 mais absent
     de lib.dom.d.ts. */
  interface FontFaceDescriptors {
    sizeAdjust?: string;
  }
}

const FACES: [family: string, url: string, sizeAdjust: string][] = [
  ["Nexus Display", pressStart2p, "62%"],
  ["Nexus Body", vt323, "138%"],
];

export function loadFonts(): Promise<unknown> {
  return Promise.all(
    FACES.map(([family, url, sizeAdjust]) => {
      const face = new FontFace(family, `url(${url}) format("woff2")`, {
        style: "normal",
        weight: "400",
        display: "swap",
        sizeAdjust,
      });
      document.fonts.add(face);
      // Un echec de chargement ne doit pas empecher l'application de demarrer :
      // le fallback monospace prend le relais.
      return face.load().catch(() => undefined);
    }),
  );
}
