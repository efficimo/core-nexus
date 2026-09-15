import type { ReactElement, ReactNode } from "react";

type Props = {
  label: string;
  icon?: ReactNode;
};

export function EmptyState({ label, icon = "◈" }: Props): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-[2.5rem] px-4 gap-2">
      <span className="w-8 h-8 flex items-center justify-center text-3xl opacity-20">{icon}</span>
      <span className="text-xs tracking-widest uppercase text-text-dim">{label}</span>
    </div>
  );
}
