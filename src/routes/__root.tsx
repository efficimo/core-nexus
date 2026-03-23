import { createRootRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LocalStorage } from "@/storage/LocalStorage";

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    if (location.href !== "/login" && !LocalStorage.get("#core-nexus/data-key")) {
      throw redirect({ to: "/login" });
    }
  },
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const isLogin = location.href === "/login";

  return (
    <>
      {!isLogin && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!isLogin && <Footer />}
      <TanStackRouterDevtools />
    </>
  );
}
