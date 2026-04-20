import type { ReactElement, SVGProps } from "react";

export function CoreNexusIcon(props: SVGProps<SVGSVGElement>): ReactElement {
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
      {/* Hexagon — le Nœud central */}
      <polygon points="10,2.5 16.5,6.25 16.5,13.75 10,17.5 3.5,13.75 3.5,6.25" />
      {/* 3 spokes vers les sommets alternés — réseau de connexions */}
      <line x1="10" y1="10" x2="10" y2="2.5" strokeOpacity="0.4" />
      <line x1="10" y1="10" x2="16.5" y2="13.75" strokeOpacity="0.4" />
      <line x1="10" y1="10" x2="3.5" y2="13.75" strokeOpacity="0.4" />
      {/* Nœud central */}
      <circle cx="10" cy="10" r="2" />
      <circle cx="10" cy="10" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
