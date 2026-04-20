import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge, EmptyState, ListRow, Panel, SparksIcon } from "@/components/ui";
import { sparksQueryOptions } from "@/data/queries";
import { statusVariant } from "./variants";

export const Route = createFileRoute("/sparks/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(sparksQueryOptions()),
  component: SparksIndex,
});

function SparksIndex() {
  const { data: sparks } = useSuspenseQuery(sparksQueryOptions());
  const navigate = useNavigate();

  return (
    <Panel title="SPARKS">
      {sparks.length === 0 ? (
        <EmptyState label="Aucune Spark pour le moment." icon={<SparksIcon />} />
      ) : (
        sparks.map((spark) => (
          <ListRow
            key={spark.id}
            label={spark.name}
            sub={spark.description}
            aside={<Badge variant={statusVariant[spark.status]}>{spark.status}</Badge>}
            onClick={() => navigate({ to: "/sparks/$sparkId", params: { sparkId: spark.id } })}
          />
        ))
      )}
    </Panel>
  );
}
