import { cx } from "@core-nexus/utils/cx";
import type { ReactElement } from "react";

type Props = {
  size?: "sm" | "lg";
  className?: string;
};

export function OrbitalOrb({ size = "sm", className }: Props): ReactElement {
  const isLg = size === "lg";
  return (
    <div
      className={cx(
        "relative flex items-center justify-center shrink-0",
        isLg ? "w-[88px] h-[88px]" : "w-[22px] h-[22px]",
        className,
      )}
    >
      {/* ring accent — CW */}
      <div
        className={cx(
          "absolute inset-0 rounded-full border-dashed border-accent",
          isLg
            ? "border-[1.5px] opacity-50 [animation:spin-cw_14s_linear_infinite]"
            : "border-[1.5px] opacity-60 [animation:spin-cw_6s_linear_infinite]",
        )}
      />
      {/* ring connected — CCW */}
      <div
        className={cx(
          "absolute rounded-full border-dashed border-connected border opacity-40 [animation:spin-ccw_9s_linear_infinite]",
          isLg ? "inset-[13px]" : "inset-[5px]",
        )}
      />
      {isLg && (
        <div className="absolute inset-[24px] rounded-full border-dashed border border-accent opacity-35 [animation:spin-cw_5s_linear_infinite]" />
      )}
      {isLg && (
        <div className="absolute inset-[34px] rounded-full bg-[rgba(46,106,255,0.08)] border border-[rgba(46,106,255,0.3)]" />
      )}
      <div
        className={cx(
          "relative z-[1] rounded-full bg-[radial-gradient(circle_at_35%_35%,#4488ff,#1a3d9e)]",
          isLg
            ? "w-[20px] h-[20px] shadow-[0_0_18px_rgba(46,106,255,0.6),0_0_36px_rgba(46,106,255,0.2)]"
            : "w-[8px] h-[8px] shadow-[0_0_6px_rgba(46,106,255,0.6)]",
        )}
      />
    </div>
  );
}
