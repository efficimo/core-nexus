import type { CSSProperties, ReactElement, ReactNode } from "react";
import { cx } from "@/utils/cx";
import styles from "./Panel.module.css";

type PanelVariant = "default" | "accent" | "success" | "error" | "warn" | "disabled";

type Props = {
  children?: ReactNode;
  variant?: PanelVariant;
  title?: string;
  className?: string;
  style?: CSSProperties;
};

const variantClass: Record<PanelVariant, string | undefined> = {
  default: undefined,
  accent: styles.panelAccent,
  success: styles.panelSuccess,
  error: styles.panelError,
  warn: styles.panelWarn,
  disabled: styles.panelDisabled,
};

export function Panel({
  children,
  variant = "default",
  title,
  className,
  style,
}: Props): ReactElement {
  return (
    <div className={cx(styles.panel, variantClass[variant], className)} style={style}>
      {title && (
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
