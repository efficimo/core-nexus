import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { cx } from "@/utils/cx";
import styles from "./Button.module.css";

type ButtonVariant = "default" | "primary" | "danger";
type ButtonSize = "sm" | "md";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const variantClass: Record<ButtonVariant, string | undefined> = {
  default: undefined,
  primary: styles.primary,
  danger: styles.danger,
};

export function Button({
  variant = "default",
  size = "md",
  children,
  className,
  ...rest
}: Props): ReactElement {
  return (
    <button
      type="button"
      className={cx(styles.btn, variantClass[variant], size === "sm" && styles.sm, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
