import type { ReactElement, SVGProps } from "react";

export function DashboardIcon(props: SVGProps<SVGSVGElement>): ReactElement {
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
      {/* Nœud principal — en haut */}
      <polygon points="10,3.7 12.6,5.2 12.6,8.2 10,9.7 7.4,8.2 7.4,5.2" />
      {/* Nœud secondaire gauche */}
      <polygon points="7.1,8.7 9.7,10.2 9.7,13.2 7.1,14.7 4.5,13.2 4.5,10.2" />
      {/* Nœud secondaire droit */}
      <polygon points="12.9,8.7 15.5,10.2 15.5,13.2 12.9,14.7 10.3,13.2 10.3,10.2" />
    </svg>
  );
}
