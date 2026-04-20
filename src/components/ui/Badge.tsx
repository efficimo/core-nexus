import type { ReactElement, ReactNode } from "react";
import { cx } from "@/utils/cx";
import styles from "./Badge.module.css";

type BadgeVariant = "default" | "accent" | "connected" | "error" | "warn" | "purple";

type Props = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClass: Record<BadgeVariant, string | undefined> = {
  default: undefined,
  accent: styles.accent,
  connected: styles.connected,
  error: styles.error,
  warn: styles.warn,
  purple: styles.purple,
};

export function Badge({ children, variant = "default", className }: Props): ReactElement {
  return <span className={cx(styles.badge, variantClass[variant], className)}>{children}</span>;
}
