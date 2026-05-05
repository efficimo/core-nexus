import type { ReactElement, ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export function Field({ label, children }: Props): ReactElement {
  return (
    <div className="flex flex-col gap-[0.35rem]">
      <span className="font-mono text-[0.5rem] tracking-[0.15em] uppercase text-text-dim">
        {label}
      </span>
      {children}
    </div>
  );
}
