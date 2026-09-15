import { asciiFold } from "@core-nexus/utils/asciiFold";
import { Children, type ReactNode } from "react";

/**
 * Applique {@link asciiFold} aux seuls segments texte d'un `children`, en
 * laissant passer les elements (icones, `<span>`, …).
 *
 * A utiliser dans les composants qui rendent en `font-display`, dont la police
 * ne couvre pas les capitales accentuees.
 *
 * Ne descend pas dans les enfants des elements : `<Button>Déconnexion</Button>`
 * et `<Button><Icon /> Déconnexion</Button>` sont replies, mais pas
 * `<Button><span>Déconnexion</span></Button>`. C'est volontaire — descendre
 * dans un arbre arbitraire reviendrait a reecrire du contenu dont le composant
 * n'a pas la responsabilite.
 */
export function foldChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child) => (typeof child === "string" ? asciiFold(child) : child));
}
