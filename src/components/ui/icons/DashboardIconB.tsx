import type { ReactElement, SVGProps } from "react";

/** Option B — Cadre à crochets : 4 coins en L + croix centrale */
export function DashboardIconB(props: SVGProps<SVGSVGElement>): ReactElement {
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
      {/* Crochets de coin */}
      <polyline points="2.5,6.5 2.5,2.5 6.5,2.5" />
      <polyline points="13.5,2.5 17.5,2.5 17.5,6.5" />
      <polyline points="17.5,13.5 17.5,17.5 13.5,17.5" />
      <polyline points="6.5,17.5 2.5,17.5 2.5,13.5" />
      {/* Croix centrale — contenu en cours de scan */}
      <line x1="10" y1="7" x2="10" y2="13" strokeOpacity="0.4" />
      <line x1="7" y1="10" x2="13" y2="10" strokeOpacity="0.4" />
      <circle cx="10" cy="10" r="0.85" fill="currentColor" stroke="none" />
    </svg>
  );
}
