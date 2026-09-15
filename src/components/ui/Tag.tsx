import { cx } from "@core-nexus/utils/cx";
import type { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Tag({ children, className }: Props): ReactElement {
  return (
    <span
      className={cx(
        /* font-mono (VT323) et non font-display : les tags sont nombreux et
           souvent longs, la police de titre y serait illisible. */
        "inline-flex items-center px-[0.4rem] py-[0.1rem] text-xs font-mono tracking-wider uppercase text-text-dim border border-text-faint",
        className,
      )}
    >
      {children}
    </span>
  );
}
