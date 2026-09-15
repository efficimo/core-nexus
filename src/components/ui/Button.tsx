import { cx } from "@core-nexus/utils/cx";
import { foldChildren } from "@core-nexus/utils/foldChildren";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

type ButtonVariant = "default" | "primary" | "go" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const VARIANT: Record<ButtonVariant, string> = {
  default: "border-border-hi text-text-dim hover:border-text-dim hover:text-text",
  primary:
    "border-accent text-accent-2 bg-accent-glow hover:border-accent-2 hover:bg-[rgba(46,155,255,0.22)] hover:text-white hover:[box-shadow:0_0_12px_var(--accent-glow)]",
  go: "border-lime text-lime bg-lime-dim hover:bg-[rgba(140,224,44,0.22)] hover:text-[#dcffb0] hover:[box-shadow:0_0_12px_var(--lime-glow)]",
  danger:
    "border-[rgba(255,47,94,0.45)] text-error bg-err-dim hover:border-error hover:bg-[rgba(255,47,94,0.22)]",
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
        "inline-flex items-center gap-[0.4rem] font-display tracking-wider uppercase border bg-transparent cursor-pointer transition-all duration-[0.15s] disabled:opacity-30 disabled:cursor-not-allowed",
        isGhost
          ? "py-[0.15rem] px-[0.3rem] text-xs"
          : size === "sm"
            ? "px-[0.6rem] py-[0.3rem] text-2xs cut-sm"
            : "px-[0.9rem] py-[0.45rem] text-xs cut-sm",
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      {foldChildren(children)}
    </button>
  );
}
