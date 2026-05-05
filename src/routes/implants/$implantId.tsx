import { EmptyState, ImplantsIcon, Panel, Tag } from "@core-nexus/components/ui";
import { HexIcon } from "@core-nexus/components/ui/icons/HexIcon";
import { implantQueryOptions } from "@core-nexus/data/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { lazy, Suspense } from "react";

const implantModules = import.meta.glob("../../implants/*/index.tsx");
const appCache = new Map<string, ComponentType>();

function loadApp(implantId: string): ComponentType | null {
  const key = `../../implants/${implantId}/index.tsx`;
  if (!implantModules[key]) return null;
  if (!appCache.has(key)) {
    appCache.set(key, lazy(implantModules[key] as () => Promise<{ default: ComponentType }>));
  }
  return appCache.get(key)!;
}

export const Route = createFileRoute("/implants/$implantId")({
  loader: ({ context: { queryClient }, params: { implantId } }) =>
    queryClient.ensureQueryData(implantQueryOptions(implantId)),
  component: ImplantDetail,
});

function ImplantDetail() {
  const { implantId } = Route.useParams();
  const { data: implant } = useSuspenseQuery(implantQueryOptions(implantId));

  const App = loadApp(implantId);
  if (App)
    return (
      <Suspense fallback={null}>
        <App />
      </Suspense>
    );

  if (!implant) {
    return <EmptyState label="Implant introuvable." icon={<ImplantsIcon />} />;
  }

  return (
    <Panel title={implant.name}>
      <div className="flex flex-col gap-[0.6rem]">
        {implant.icon && <HexIcon def={implant.icon} className="w-[3rem] h-[3rem] text-accent" />}
        <p className="text-text-dim leading-[1.6]">{implant.description}</p>
        {implant.tags.length > 0 && (
          <div className="flex gap-[0.4rem] flex-wrap">
            {implant.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
