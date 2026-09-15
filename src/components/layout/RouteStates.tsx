import { Button, DuckLoader } from "@core-nexus/components/ui";
import { asciiFold } from "@core-nexus/utils/asciiFold";
import type { ErrorComponentProps } from "@tanstack/react-router";
import type { ReactElement } from "react";

/**
 * Etats de route communs a toute l'application.
 *
 * Les pages consomment leurs donnees avec `useSuspenseQuery` derriere un
 * `loader` de route : elles ne voient donc jamais d'etat « en cours » ni
 * d'erreur elles-memes, c'est le routeur qui rend ces deux composants a la
 * place de l'`Outlet`. Les brancher une fois sur le routeur les applique a
 * toutes les routes, presentes et a venir.
 */

const WRAP = "flex flex-col items-center justify-center gap-[0.9rem] py-[3.5rem] px-4";

export function RoutePending(): ReactElement {
  return (
    <div className={WRAP}>
      <DuckLoader variant="scan" size={64} label="Chargement des donnees" />
      <span className="font-display text-3xs tracking-ultra uppercase text-text-faint">
        {asciiFold("Lecture du Nexus…")}
      </span>
    </div>
  );
}

export function RouteError({ error, reset }: ErrorComponentProps): ReactElement {
  return (
    <div className={WRAP}>
      <DuckLoader variant="glitch" size={64} label="Erreur" />
      <span className="font-display text-2xs tracking-ultra uppercase text-error">
        {asciiFold("Lecture impossible")}
      </span>
      {/* Le message brut aide au diagnostic : les erreurs attendues ici sont
          des echecs de dechiffrement ou de schema, pas des donnees sensibles. */}
      <span className="max-w-[32rem] text-center text-sm text-text-dim">{error.message}</span>
      <Button variant="primary" onClick={reset}>
        Reessayer
      </Button>
    </div>
  );
}
