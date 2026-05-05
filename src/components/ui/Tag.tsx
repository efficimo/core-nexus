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
        "inline-flex items-center px-[0.4rem] py-[0.1rem] text-[0.45rem] font-mono tracking-[0.18em] uppercase text-text-dim border border-text-faint rounded-[1px]",
        className,
      )}
    >
      {children}
    </span>
  );
}
