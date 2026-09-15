import "./styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { checkBuildVersion } from "./boot";
import { RouteError, RoutePending } from "./components/layout/RouteStates";
import { routeTree } from "./routeTree.gen";
import { loadFonts } from "./styles/fonts";

window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

await checkBuildVersion();
void loadFonts();

const queryClient = new QueryClient();

const basepath = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
const router = createRouter({
  routeTree,
  basepath,
  context: { queryClient },
  defaultPendingComponent: RoutePending,
  defaultErrorComponent: RouteError,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
