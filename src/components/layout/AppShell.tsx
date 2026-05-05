import {
  ArchitectesIcon,
  DashboardIcon,
  HexBackground,
  ImplantsIcon,
  SigilsIcon,
  SparksIcon,
} from "@core-nexus/components/ui";
import { useLocation } from "@tanstack/react-router";
import type { ReactElement, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { TopBar, type TopBarTag } from "./TopBar";

type Props = {
  children: ReactNode;
};

const ROUTE_TAGS: Record<string, TopBarTag[]> = {
  "/": [{ label: "Dashboard", icon: DashboardIcon }],
  "/architects": [{ label: "Architectes", icon: ArchitectesIcon }],
  "/sparks": [{ label: "Sparks", icon: SparksIcon }],
  "/implants": [{ label: "Implants", icon: ImplantsIcon }],
  "/sigils": [{ label: "Sigils", icon: SigilsIcon }],
};

const NON_ROOT_KEYS = Object.keys(ROUTE_TAGS).filter((k) => k !== "/");

function resolveTags(pathname: string): TopBarTag[] | undefined {
  if (pathname === "/") return ROUTE_TAGS["/"];
  const key = NON_ROOT_KEYS.find((k) => pathname.startsWith(k));
  return key ? ROUTE_TAGS[key] : undefined;
}

function restartAnimation(el: HTMLElement | null) {
  if (!el) return;
  el.style.animation = "none";
  void el.offsetHeight;
  el.style.animation = "";
}

export function AppShell({ children }: Props): ReactElement {
  const { pathname } = useLocation();
  const scanRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname déclenche le restart d'animation, il n'est pas lu dans le callback
  useLayoutEffect(() => {
    restartAnimation(scanRef.current);
    restartAnimation(contentRef.current);
  }, [pathname]);

  return (
    <div className="grid [grid-template-columns:var(--sidebar-w)_1fr] [grid-template-rows:var(--topbar-h)_1fr_var(--footer-h)] h-screen overflow-hidden">
      <TopBar tags={resolveTags(pathname)} />
      <Sidebar />
      <main className="[grid-column:2] [grid-row:2] relative overflow-hidden">
        <HexBackground />
        <div
          ref={scanRef}
          className="fixed top-[var(--topbar-h)] left-[var(--sidebar-w)] right-0 h-[2px] bg-[linear-gradient(90deg,transparent_0%,var(--accent)_30%,var(--accent-2)_60%,transparent_100%)] [box-shadow:0_0_8px_var(--accent)] animate-shell-scan pointer-events-none z-[100]"
        />
        <div
          ref={contentRef}
          className="absolute inset-0 overflow-y-auto z-[1] p-[var(--content-p)] animate-shell-enter"
        >
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
