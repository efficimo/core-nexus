import type { ReactElement } from "react";
import { cx } from "@/utils/cx";
import styles from "./StatusDot.module.css";

type DotStatus = "connected" | "error" | "warn" | "disconnected";

type Props = {
  status: DotStatus;
  label?: string;
};

const statusClass: Record<DotStatus, string> = {
  connected: styles.connected as string,
  error: styles.error as string,
  warn: styles.warn as string,
  disconnected: styles.disconnected as string,
};

export function StatusDot({ status, label }: Props): ReactElement {
  return (
    <span className={cx(styles.wrapper, statusClass[status])}>
      <span className={styles.dot} />
      {label && <span className={styles.label}>{label}</span>}
    </span>
  );
}
