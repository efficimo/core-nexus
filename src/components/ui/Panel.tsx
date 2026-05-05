import { cx } from "@core-nexus/utils/cx";
import type { CSSProperties, ReactElement, ReactNode } from "react";

type PanelVariant = "default" | "accent" | "success" | "error" | "warn" | "disabled";

type Props = {
  children?: ReactNode;
  variant?: PanelVariant;
  title?: string;
  fill?: boolean;
  className?: string;
  style?: CSSProperties;
};

const VARIANT_CLS: Record<PanelVariant, string> = {
  default: "border-border",
  accent: "border-accent panel-accent",
  success: "border-connected panel-success",
  error: "border-error panel-error",
  warn: "border-warn panel-warn",
  disabled: "border-dashed border-border-hi opacity-50",
};

export function Panel({
  children,
  variant = "default",
  title,
  fill,
  className,
  style,
}: Props): ReactElement {
  return (
    <div
      className={cx(
        "relative bg-surface border cut animate-panel-in",
        fill && "flex flex-col",
        variant !== "disabled" && "panel-corner",
        VARIANT_CLS[variant],
        className,
      )}
      style={style}
    >
      {title && (
        <div
          className={cx(
            "px-[0.9rem] py-[0.55rem] border-b border-border flex items-center gap-[0.5rem]",
            fill && "shrink-0",
          )}
        >
          <span className="font-display text-[0.5rem] font-bold tracking-[0.2em] uppercase text-text-dim">
            {title}
          </span>
        </div>
      )}
      <div className={cx("panel-body p-[0.9rem]", fill && "flex-1 min-h-0")}>{children}</div>
    </div>
  );
}
