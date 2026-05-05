import type { ReactElement, ReactNode } from "react";

type Props = {
  label: string;
  icon?: ReactNode;
};

export function EmptyState({ label, icon = "◈" }: Props): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-[2.5rem] px-4 gap-2">
      <span className="w-8 h-8 flex items-center justify-center text-[1.4rem] opacity-20">
        {icon}
      </span>
      <span className="text-[0.52rem] tracking-[0.15em] uppercase text-text-dim">{label}</span>
    </div>
  );
}
