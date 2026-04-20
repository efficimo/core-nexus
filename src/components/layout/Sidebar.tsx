import { Link } from "@tanstack/react-router";
import type { ComponentType, ReactElement, SVGProps } from "react";
import { ArchitectesIcon, DashboardIcon, ImplantsIcon, SigilsIcon, SparksIcon } from "../ui/icons";
import styles from "./Sidebar.module.css";

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
    ],
  },
];

export function Sidebar(): ReactElement {
  return (
    <nav className={styles.sidebar}>
      {NAV.map((group) => (
        <div key={group.section} className={styles.section}>
          <div className={styles.sectionTitle}>{group.section}</div>
          {group.items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={styles.navItem}
                activeProps={{ className: `${styles.navItem} ${styles.navItemActive}` }}
                activeOptions={{ exact: item.exact }}
              >
                <Icon className={styles.navIcon} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
