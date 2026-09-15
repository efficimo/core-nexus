import { asciiFold } from "@core-nexus/utils/asciiFold";
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
  default: "",
  accent: "panel-accent",
  success: "panel-success",
  error: "panel-error",
  warn: "panel-warn",
  disabled: "panel-disabled",
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
        "relative cut hud-frame animate-panel-in",
        fill && "flex flex-col",
        VARIANT_CLS[variant],
        className,
      )}
      style={style}
    >
      <div
        className={cx(
          "relative cut hud-inner",
          fill && "flex flex-col flex-1 min-h-0",
          variant !== "disabled" && "hud-bracket",
        )}
      >
        {title && (
          <div
            className={cx(
              "px-[0.9rem] py-[0.55rem] border-b border-border flex items-center gap-[0.5rem] bg-[linear-gradient(90deg,var(--accent-glow),transparent_60%)]",
              fill && "shrink-0",
            )}
          >
            <span className="font-display text-xs tracking-widest uppercase text-accent-2">
              {asciiFold(title)}
            </span>
          </div>
        )}
        <div className={cx("panel-body p-[0.9rem]", fill && "flex-1 min-h-0")}>{children}</div>
      </div>
    </div>
  );
}
