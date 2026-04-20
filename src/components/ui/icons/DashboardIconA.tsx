import type { ReactElement, SVGProps } from "react";

/** Option A — Réticule HUD : anneau + encoches cardinales + nœud */
export function DashboardIconA(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="10" cy="10" r="7" />
      {/* Encoches cardinales extérieures */}
      <line x1="10" y1="2" x2="10" y2="3.5" />
      <line x1="10" y1="16.5" x2="10" y2="18" />
      <line x1="2" y1="10" x2="3.5" y2="10" />
      <line x1="16.5" y1="10" x2="18" y2="10" />
      {/* Encoches intérieures — profondeur */}
      <line x1="10" y1="4.5" x2="10" y2="6.5" strokeOpacity="0.4" />
      <line x1="10" y1="13.5" x2="10" y2="15.5" strokeOpacity="0.4" />
      <line x1="4.5" y1="10" x2="6.5" y2="10" strokeOpacity="0.4" />
      <line x1="13.5" y1="10" x2="15.5" y2="10" strokeOpacity="0.4" />
      <circle cx="10" cy="10" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
