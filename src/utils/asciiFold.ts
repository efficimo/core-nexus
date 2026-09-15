/**
 * Replie les diacritiques et les ligatures latines vers de l'ASCII.
 *
 * Press Start 2P, la police de titre, ne couvre pas les capitales accentuees :
 * « Déconnexion » en majuscules y rend « DeCONNEXION », le glyphe manquant
 * tombant en fallback sur une autre fonte. Le repli se fait donc AU RENDU,
 * dans les composants qui dessinent en `font-display` — jamais dans les
 * donnees : les sources gardent leurs accents, et tout ce qui s'affiche en
 * `font-mono` (VT323, qui couvre le latin etendu) les rend normalement.
 *
 * @example
 * asciiFold("Déconnexion")  // "Deconnexion"
 * asciiFold("NŒUD")         // "NOEUD"
 * asciiFold("Rare · 3")     // "Rare · 3"  (le point median est preserve)
 */

/** Ligatures et lettres barrees : NFD ne les decompose pas. */
const LIGATURES: Record<string, string> = {
  Œ: "OE",
  œ: "oe",
  Æ: "AE",
  æ: "ae",
  ß: "ss",
  Ø: "O",
  ø: "o",
  Đ: "D",
  đ: "d",
  Ł: "L",
  ł: "l",
};

const LIGATURE_RE = new RegExp(`[${Object.keys(LIGATURES).join("")}]`, "g");

/**
 * On cible \p{Mn} (marques combinantes sans chasse), ce que produit la
 * decomposition NFD — et non \p{Diacritic}, qui engloberait U+00B7 MIDDLE DOT,
 * separateur courant de l'interface (« Legendaire · 1 porteur »).
 */
const COMBINING_RE = /\p{Mn}/gu;

export function asciiFold(value: string): string {
  return value
    .replace(LIGATURE_RE, (c) => LIGATURES[c] ?? c)
    .normalize("NFD")
    .replace(COMBINING_RE, "")
    .normalize("NFC");
}
