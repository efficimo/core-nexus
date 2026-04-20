import { LocalStorage, SessionStorage } from "@efficimo/storage";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ComponentType, ReactElement, ReactNode, SVGProps } from "react";
import { OrbitalOrb, StatusDot } from "@/components/ui";
import styles from "./TopBar.module.css";

export type TopBarTag = {
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

type Props = {
  tags?: TopBarTag[];
  right?: ReactNode;
};

function AppRight(): ReactElement {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const email = LocalStorage.get("#core-nexus/user-email") ?? "";

  const handleLogout = () => {
    queryClient.clear();
    SessionStorage.clear();
    LocalStorage.remove("#core-nexus/data-key");
    LocalStorage.remove("#core-nexus/user-email");
    navigate({ to: "/login" });
  };

  return (
    <>
      <StatusDot status="connected" label="système actif" />
      {email && <span className={styles.userEmail}>{email}</span>}
      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        Déconnexion
      </button>
    </>
  );
}

export function TopBar({ tags, right }: Props): ReactElement {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <OrbitalOrb size="sm" />
        <span className={styles.brandName}>CORE NEXUS</span>
        {tags && tags.length > 0 && (
          <>
            <div className={styles.sep} />
            <div className={styles.tags}>
              {tags.map(({ label, icon: Icon }) => (
                <span key={label} className={styles.tag}>
                  {Icon && <Icon className={styles.tagIcon} />}
                  {label}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={styles.right}>{right ?? <AppRight />}</div>
    </header>
  );
}
