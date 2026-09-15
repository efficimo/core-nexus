import type { ReactElement } from "react";

export function Footer(): ReactElement {
  return (
    <footer className="flex items-center justify-between px-[1.25rem] bg-surface border-t border-border">
      <span className="text-2xs tracking-ultra uppercase text-text-faint">
        Tenir la Ligne Zéro. Corriger l'irréparable.
      </span>
      <span className="text-3xs text-text-faint tracking-wider">build {__APP_VERSION__}</span>
    </footer>
  );
}
