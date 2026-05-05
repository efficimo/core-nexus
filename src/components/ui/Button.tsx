import { cx } from "@core-nexus/utils/cx";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

type ButtonVariant = "default" | "primary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const VARIANT: Record<ButtonVariant, string> = {
  default: "border-border-hi text-text-dim hover:border-text-dim hover:text-text",
  primary:
    "border-accent text-accent-2 bg-accent-glow hover:border-accent-2 hover:bg-[rgba(46,106,255,0.2)] hover:text-white",
  danger:
    "border-[rgba(255,32,85,0.4)] text-error bg-err-dim hover:border-error hover:bg-[rgba(255,32,85,0.2)]",
  ghost:
    "border-transparent bg-transparent text-text-faint hover:text-error hover:border-transparent",
};

export function Button({
  variant = "default",
  size = "md",
  children,
  className,
  ...rest
}: Props): ReactElement {
  const isGhost = variant === "ghost";
  return (
    <button
      type="button"
      className={cx(
        "inline-flex items-center gap-[0.4rem] font-mono tracking-[0.12em] uppercase border bg-transparent cursor-pointer transition-all duration-[0.15s] disabled:opacity-35 disabled:cursor-not-allowed",
        isGhost
          ? "py-[0.15rem] px-[0.3rem] text-[0.58rem]"
          : size === "sm"
            ? "px-[0.6rem] py-[0.25rem] text-[0.5rem] cut-sm"
            : "px-[0.9rem] py-[0.45rem] text-[0.58rem] cut-sm",
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
