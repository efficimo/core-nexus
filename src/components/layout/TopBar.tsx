import { OrbitalOrb, StatusDot } from "@core-nexus/components/ui";
import { LocalStorage, SessionStorage } from "@efficimo/storage";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ComponentType, ReactElement, ReactNode, SVGProps } from "react";

export type TopBarTag = {
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

type Props = {
  tags?: TopBarTag[];
  right?: ReactNode;
};

function AppRight(): ReactElement {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const email = LocalStorage.get("#core-nexus/user-email") ?? "";

  const handleLogout = () => {
    queryClient.clear();
    SessionStorage.clear();
    LocalStorage.remove("#core-nexus/data-key");
    LocalStorage.remove("#core-nexus/user-email");
    navigate({ to: "/login" });
  };

  return (
    <>
      <StatusDot status="connected" label="système actif" />
      {email && <span className="text-[0.5rem] text-text-dim tracking-[0.08em]">{email}</span>}
      <button
        type="button"
        className="px-[0.6rem] py-[0.2rem] text-[0.48rem] font-mono tracking-[0.12em] uppercase border border-border-hi bg-transparent text-text-dim cursor-pointer transition-all duration-[0.15s] hover:border-error hover:text-error"
        onClick={handleLogout}
      >
        Déconnexion
      </button>
    </>
  );
}

export function TopBar({ tags, right }: Props): ReactElement {
  return (
    <header className="[grid-column:1/-1] [grid-row:1] flex items-center justify-between px-4 bg-surface border-b border-border z-10">
      <div className="flex items-center gap-[0.5rem]">
        <OrbitalOrb size="sm" />
        <span className="font-display text-[0.65rem] font-black tracking-[0.22em] text-text">
          CORE NEXUS
        </span>
        {tags && tags.length > 0 && (
          <>
            <div className="w-px h-[20px] bg-border mx-[0.25rem]" />
            <div className="flex items-center gap-[0.3rem]">
              {tags.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="flex items-center gap-[0.35rem] px-[0.45rem] py-[0.12rem] text-[0.48rem] tracking-[0.15em] border border-[rgba(46,106,255,0.3)] bg-[rgba(46,106,255,0.08)] text-accent [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))]"
                >
                  {Icon && <Icon className="w-[0.75rem] h-[0.75rem] shrink-0" />}
                  {label}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">{right ?? <AppRight />}</div>
    </header>
  );
}
