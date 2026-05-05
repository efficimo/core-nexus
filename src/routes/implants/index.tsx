import { EmptyState, ImplantsIcon, ListRow, Panel } from "@core-nexus/components/ui";
import { HexIcon } from "@core-nexus/components/ui/icons/HexIcon";
import { implantsQueryOptions } from "@core-nexus/data/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/implants/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(implantsQueryOptions()),
  component: ImplantsIndex,
});

function ImplantsIndex() {
  const { data: implants } = useSuspenseQuery(implantsQueryOptions());
  const navigate = useNavigate();

  return (
    <Panel title="IMPLANTS">
      {implants.length === 0 ? (
        <EmptyState label="Aucun Implant pour le moment." icon={<ImplantsIcon />} />
      ) : (
        implants.map((implant) => (
          <ListRow
            key={implant.id}
            label={implant.name}
            sub={implant.description}
            icon={implant.icon ? <HexIcon def={implant.icon} className="w-8 h-8" /> : undefined}
            onClick={() =>
              navigate({ to: "/implants/$implantId", params: { implantId: implant.id } })
            }
          />
        ))
      )}
    </Panel>
  );
}
