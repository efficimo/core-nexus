import { cx } from "@core-nexus/utils/cx";
import type { ReactElement } from "react";

type DotStatus = "connected" | "error" | "warn" | "disconnected";

type Props = {
  status: DotStatus;
  label?: string;
};

const DOT: Record<DotStatus, string> = {
  connected: "bg-connected [box-shadow:0_0_8px_var(--connected-glow)] animate-dot-pulse",
  error: "bg-error [box-shadow:0_0_8px_rgba(255,47,94,0.5)] animate-dot-blink",
  warn: "bg-warn [animation:dot-pulse_1.5s_ease-in-out_infinite]",
  disconnected: "bg-text-faint",
};

const LABEL: Record<DotStatus, string> = {
  connected: "text-connected",
  error: "text-error",
  warn: "text-warn",
  disconnected: "text-text-dim",
};

export function StatusDot({ status, label }: Props): ReactElement {
  return (
    <span className="inline-flex items-center gap-[0.4rem]">
      {/* Carre plutot que rond : la grille pixel ne tolere pas les arrondis. */}
      <span className={cx("w-[7px] h-[7px] shrink-0", DOT[status])} />
      {label && (
        <span className={cx("text-xs tracking-wider uppercase", LABEL[status])}>{label}</span>
      )}
    </span>
  );
}
