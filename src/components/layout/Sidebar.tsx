import { asciiFold } from "@core-nexus/utils/asciiFold";
import { Link } from "@tanstack/react-router";
import type { ComponentType, ReactElement, SVGProps } from "react";
import {
  ArchitectesIcon,
  DashboardIcon,
  DirectivesIcon,
  ImplantsIcon,
  SigilsIcon,
  SparksIcon,
} from "../ui/icons";

const NAV: {
  section: string;
  items: {
    to: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
    exact: boolean;
  }[];
}[] = [
  {
    section: "Navigation",
    items: [
      { to: "/", icon: DashboardIcon, label: "Dashboard", exact: true },
      { to: "/architects", icon: ArchitectesIcon, label: "Architectes", exact: false },
      { to: "/sparks", icon: SparksIcon, label: "Sparks", exact: false },
      { to: "/implants", icon: ImplantsIcon, label: "Implants", exact: false },
      { to: "/sigils", icon: SigilsIcon, label: "Sigils", exact: false },
      { to: "/missions", icon: DirectivesIcon, label: "Directives", exact: false },
    ],
  },
];

/* Les classes border-l-* (longhand) évitent le conflit avec border-* (shorthand) */
const navBase =
  "flex items-center gap-[0.55rem] px-[0.9rem] py-[0.45rem] text-base tracking-wide uppercase text-text-dim no-underline transition-all duration-[0.12s] border-l-[3px] border-l-transparent hover:text-text hover:bg-[rgba(110,180,255,0.04)] hover:border-l-border-hi";

const navActive = `${navBase} text-lime bg-[linear-gradient(90deg,var(--lime-dim),transparent_70%)] border-l-lime hover:text-lime hover:border-l-lime`;

export function Sidebar(): ReactElement {
  return (
    <nav className="[grid-column:1] [grid-row:2/4] bg-surface border-r border-border overflow-y-auto flex flex-col py-[0.75rem]">
      {NAV.map((group) => (
        <div key={group.section} className="mb-[0.5rem]">
          <div className="px-[0.9rem] py-[0.4rem] pb-[0.25rem] font-display text-3xs tracking-ultra uppercase text-text-faint">
            {asciiFold(group.section)}
          </div>
          {group.items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={navBase}
                activeProps={{ className: navActive }}
                activeOptions={{ exact: item.exact }}
              >
                <Icon className="w-[0.85rem] h-[0.85rem] shrink-0 block" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
