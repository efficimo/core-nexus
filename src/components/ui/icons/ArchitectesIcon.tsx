import type { ReactElement, SVGProps } from "react";

export function ArchitectesIcon(props: SVGProps<SVGSVGElement>): ReactElement {
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
      {/* Brackets de compilation < > — les Architectes codent la réalité */}
      <polyline points="7,5 3.5,10 7,15" />
      <polyline points="13,5 16.5,10 13,15" />
      {/* Diamant ◈ — Pattern, l'essence de leur doctrine */}
      <polygon points="10,6.5 13.5,10 10,13.5 6.5,10" />
      <circle cx="10" cy="10" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
