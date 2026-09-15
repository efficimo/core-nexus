import { cx } from "@core-nexus/utils/cx";
import { foldChildren } from "@core-nexus/utils/foldChildren";
import type { ReactElement, ReactNode } from "react";

type BadgeVariant = "default" | "accent" | "connected" | "lime" | "error" | "warn" | "purple";

type Props = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const BASE =
  "inline-flex items-center px-[0.5rem] py-[0.2rem] text-3xs font-display tracking-widest uppercase border whitespace-nowrap";

const LIME = "border-[rgba(140,224,44,0.45)] text-lime bg-lime-dim";

const VARIANT: Record<BadgeVariant, string> = {
  default: "border-border-hi text-text-dim bg-transparent",
  accent: "border-[rgba(46,155,255,0.45)] text-accent-2 bg-accent-glow",
  connected: LIME,
  lime: LIME,
  error: "border-[rgba(255,47,94,0.4)] text-error bg-err-dim",
  warn: "border-[rgba(255,176,32,0.4)] text-warn bg-warn-dim",
  purple: "border-[rgba(168,85,247,0.35)] text-purple bg-purple-dim",
};

export function Badge({ children, variant = "default", className }: Props): ReactElement {
  return <span className={cx(BASE, VARIANT[variant], className)}>{foldChildren(children)}</span>;
}
