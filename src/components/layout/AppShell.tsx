import { useLocation } from "@tanstack/react-router";
import type { ReactElement, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import {
  ArchitectesIcon,
  DashboardIcon,
  HexBackground,
  ImplantsIcon,
  SigilsIcon,
  SparksIcon,
} from "@/components/ui";
import styles from "./AppShell.module.css";
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
    <div className={styles.shell}>
      <TopBar tags={resolveTags(pathname)} />
      <Sidebar />
      <main className={styles.main}>
        <HexBackground />
        <div ref={scanRef} className={styles.scan} />
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
