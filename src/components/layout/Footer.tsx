import type { ReactElement } from "react";

export function Footer(): ReactElement {
  return (
    <footer className="flex items-center justify-between px-[1.25rem] bg-surface border-t border-border">
      <span className="text-[0.45rem] tracking-[0.2em] uppercase text-text-faint">
        Tenir la Ligne Zéro. Corriger l'irréparable.
      </span>
      <span className="text-[0.42rem] text-text-faint tracking-[0.08em]">
        build {__APP_VERSION__}
      </span>
    </footer>
  );
}
