import type { ReactElement, ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export function Field({ label, children }: Props): ReactElement {
  return (
    <div className="flex flex-col gap-[0.35rem]">
      <span className="font-mono text-xs tracking-widest uppercase text-text-dim">{label}</span>
      {children}
    </div>
  );
}
