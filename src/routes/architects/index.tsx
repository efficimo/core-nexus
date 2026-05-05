import { ArchitectesIcon, Badge, EmptyState, ListRow, Panel } from "@core-nexus/components/ui";
import { architectsQueryOptions } from "@core-nexus/data/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/architects/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(architectsQueryOptions()),
  component: ArchitectsIndex,
});

function ArchitectsIndex() {
  const { data: architects } = useSuspenseQuery(architectsQueryOptions());
  const navigate = useNavigate();

  return (
    <Panel title="ARCHITECTES">
      {architects.length === 0 ? (
        <EmptyState label="Aucun Architecte enregistré." icon={<ArchitectesIcon />} />
      ) : (
        architects.map((architect) => (
          <ListRow
            key={architect.id}
            label={architect.name}
            sub={architect.title}
            aside={<Badge variant="accent">{architect.class}</Badge>}
            onClick={() =>
              navigate({ to: "/architects/$architectId", params: { architectId: architect.id } })
            }
          />
        ))
      )}
    </Panel>
  );
}
