import type { ReactElement, SVGProps } from "react";

export function ImplantsIcon(props: SVGProps<SVGSVGElement>): ReactElement {
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
      {/* Corps du circuit imprimé */}
      <rect x="5.5" y="5.5" width="9" height="9" />
      {/* Broches supérieures */}
      <line x1="8" y1="5.5" x2="8" y2="3" />
      <line x1="12" y1="5.5" x2="12" y2="3" />
      {/* Broches inférieures */}
      <line x1="8" y1="14.5" x2="8" y2="17" />
      <line x1="12" y1="14.5" x2="12" y2="17" />
      {/* Broches gauches */}
      <line x1="5.5" y1="8" x2="3" y2="8" />
      <line x1="5.5" y1="12" x2="3" y2="12" />
      {/* Broches droites */}
      <line x1="14.5" y1="8" x2="17" y2="8" />
      <line x1="14.5" y1="12" x2="17" y2="12" />
      {/* Noyau interne */}
      <rect x="8" y="8" width="4" height="4" />
    </svg>
  );
}
