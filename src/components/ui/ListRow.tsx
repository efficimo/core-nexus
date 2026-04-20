import type { ReactElement, ReactNode } from "react";
import { cx } from "@/utils/cx";
import styles from "./ListRow.module.css";

type Props = {
  label: string;
  sub?: string;
  aside?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

export function ListRow({ label, sub, aside, active, onClick, className }: Props): ReactElement {
  const interactive = onClick
    ? {
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => e.key === "Enter" && onClick(),
        role: "button" as const,
        tabIndex: 0,
      }
    : {};
  return (
    <div
      className={cx(styles.row, onClick && styles.clickable, active && styles.active, className)}
      {...interactive}
    >
      <div className={styles.main}>
        <div className={styles.label}>{label}</div>
        {sub && <div className={styles.sub}>{sub}</div>}
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </div>
  );
}
