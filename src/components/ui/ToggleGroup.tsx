import { cx } from "@core-nexus/utils/cx";
import type { ReactElement } from "react";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: ReadonlyArray<Option<T>>;
  value: T;
  onChange: (value: T) => void;
};

export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: Props<T>): ReactElement {
  return (
    <div className="flex gap-[0.3rem] flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={cx(
            "inline-flex items-center px-[0.6rem] py-[0.25rem] font-mono text-[0.52rem] tracking-[0.08em] uppercase border cursor-pointer transition-all duration-[0.15s] cut-sm",
            value === opt.value
              ? "border-accent text-accent-2 bg-accent-glow"
              : "border-border-hi text-text-dim bg-transparent hover:border-text-dim hover:text-text",
          )}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
