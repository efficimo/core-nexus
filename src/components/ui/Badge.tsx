import { cx } from "@core-nexus/utils/cx";
import type { ReactElement, ReactNode } from "react";

type BadgeVariant = "default" | "accent" | "connected" | "error" | "warn" | "purple";

type Props = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const BASE =
  "inline-flex items-center px-[0.5rem] py-[0.15rem] text-[0.48rem] font-mono tracking-[0.15em] uppercase rounded-[2px] border whitespace-nowrap";

const VARIANT: Record<BadgeVariant, string> = {
  default: "border-border-hi text-text-dim bg-transparent",
  accent: "border-[rgba(46,106,255,0.4)] text-accent-2 bg-accent-glow",
  connected: "border-[rgba(0,230,118,0.35)] text-connected bg-con-dim",
  error: "border-[rgba(255,32,85,0.35)] text-error bg-err-dim",
  warn: "border-[rgba(255,171,0,0.35)] text-warn bg-warn-dim",
  purple: "border-[rgba(168,85,247,0.35)] text-purple bg-purple-dim",
};

export function Badge({ children, variant = "default", className }: Props): ReactElement {
  return <span className={cx(BASE, VARIANT[variant], className)}>{children}</span>;
}
