import { cx } from "@core-nexus/utils/cx";
import type { ReactElement, ReactNode } from "react";

type Props = {
  label: string;
  sub?: string;
  icon?: ReactNode;
  aside?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

export function ListRow({
  label,
  sub,
  icon,
  aside,
  active,
  onClick,
  className,
}: Props): ReactElement {
  const interactive = onClick
    ? {
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => e.key === "Enter" && onClick(),
        role: "button" as const,
        tabIndex: 0,
      }
    : {};
  return (
    <div
      className={cx(
        "flex items-center gap-[0.75rem] px-[0.9rem] py-[0.55rem] border-b border-text-faint transition-[background] duration-[0.1s] last:border-b-0 hover:bg-[rgba(255,255,255,0.025)]",
        onClick ? "cursor-pointer" : "cursor-default",
        active && "bg-accent-glow border-l-2 border-l-accent",
        className,
      )}
      {...interactive}
    >
      {icon && <div className="shrink-0 text-text-dim">{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="text-[0.6rem] text-text whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </div>
        {sub && <div className="text-[0.5rem] text-text-dim mt-[0.1rem]">{sub}</div>}
      </div>
      {aside && <div className="flex items-center gap-[0.4rem] shrink-0">{aside}</div>}
    </div>
  );
}
