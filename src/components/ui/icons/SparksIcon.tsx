import type { ReactElement, SVGProps } from "react";

export function SparksIcon(props: SVGProps<SVGSVGElement>): ReactElement {
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
      {/* Hexagone — contenant de l'énergie */}
      <polygon points="10,2.5 16.5,6.25 16.5,13.75 10,17.5 3.5,13.75 3.5,6.25" />
      {/* Éclair intérieur */}
      <polyline points="12,5.5 8.5,10.5 11.5,10.5 8,14.5" />
    </svg>
  );
}
