import { cx } from "@core-nexus/utils/cx";
import type { InputHTMLAttributes, ReactElement } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, ...rest }: Props): ReactElement {
  return (
    <div className="flex flex-col gap-[0.35rem]">
      {label && (
        <label
          className={cx(
            "font-mono text-[0.5rem] tracking-[0.15em] uppercase",
            error ? "text-error" : "text-text-dim",
          )}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cx(
          "w-full px-[0.85rem] py-[0.6rem] bg-surface-2 border text-text text-[0.6rem] font-mono outline-none cut-sm placeholder:text-text-faint focus:border-accent focus:shadow-[0_0_0_1px_rgba(46,106,255,0.2),inset_0_0_12px_rgba(46,106,255,0.04)] [transition:border-color_0.15s_var(--ease),box-shadow_0.15s_var(--ease)]",
          error ? "border-[rgba(255,32,85,0.5)]" : "border-border-hi",
          className,
        )}
        {...rest}
      />
      {error && <span className="text-[0.48rem] text-error tracking-[0.05em]">{error}</span>}
    </div>
  );
}
