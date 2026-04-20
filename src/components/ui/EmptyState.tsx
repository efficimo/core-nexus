import type { ReactElement, ReactNode } from "react";
import styles from "./EmptyState.module.css";

type Props = {
  label: string;
  icon?: ReactNode;
};

export function EmptyState({ label, icon = "◈" }: Props): ReactElement {
  return (
    <div className={styles.empty}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
