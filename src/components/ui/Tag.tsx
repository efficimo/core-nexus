import type { ReactElement, ReactNode } from "react";
import { cx } from "@/utils/cx";
import styles from "./Tag.module.css";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Tag({ children, className }: Props): ReactElement {
  return <span className={cx(styles.tag, className)}>{children}</span>;
}
