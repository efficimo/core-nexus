import type { ReactElement } from "react";
import { cx } from "@/utils/cx";
import styles from "./OrbitalOrb.module.css";

type Props = {
  size?: "sm" | "lg";
  className?: string;
};

export function OrbitalOrb({ size = "sm", className }: Props): ReactElement {
  const isLg = size === "lg";
  return (
    <div className={cx(styles.orb, isLg ? styles.lg : styles.sm, className)}>
      <div className={styles.ring} />
      <div className={styles.ring} />
      {isLg && <div className={styles.ring} />}
      {isLg && <div className={styles.coreOuter} />}
      <div className={styles.core} />
    </div>
  );
}
