import { StatusDot } from "@core-nexus/components/ui";
import { DuckLogo } from "@core-nexus/components/ui/icons/DuckLogo";
import { asciiFold } from "@core-nexus/utils/asciiFold";
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
      {email && <span className="text-xs text-text-dim tracking-wider">{email}</span>}
      <button
        type="button"
        className="px-[0.6rem] py-[0.25rem] text-2xs font-display tracking-widest uppercase border border-border-hi bg-transparent text-text-dim cursor-pointer transition-all duration-[0.15s] hover:border-error hover:text-error"
        onClick={handleLogout}
      >
        {asciiFold("Déconnexion")}
      </button>
    </>
  );
}

export function TopBar({ tags, right }: Props): ReactElement {
  return (
    <header className="[grid-column:1/-1] [grid-row:1] flex items-center justify-between px-4 bg-surface border-b border-transparent [border-image:var(--grad)_1] z-10">
      <div className="flex items-center gap-[0.6rem]">
        <DuckLogo size={34} />
        <div className="leading-tight">
          <div className="font-display text-xs tracking-widest uppercase text-accent-2">
            Core Nexus
          </div>
          <div className="font-display text-3xs tracking-widest uppercase text-lime">
            {"// pixel architect"}
          </div>
        </div>
        {tags && tags.length > 0 && (
          <>
            <div className="w-px h-[22px] bg-border-hi mx-[0.35rem]" />
            <div className="flex items-center gap-[0.3rem]">
              {tags.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="flex items-center gap-[0.35rem] px-[0.5rem] py-[0.18rem] font-display text-3xs tracking-widest uppercase border border-[rgba(46,155,255,0.35)] bg-accent-glow text-accent [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))]"
                >
                  {Icon && <Icon className="w-[0.75rem] h-[0.75rem] shrink-0" />}
                  {asciiFold(label)}
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
