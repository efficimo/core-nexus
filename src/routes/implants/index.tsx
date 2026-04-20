import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EmptyState, ImplantsIcon, ListRow, Panel } from "@/components/ui";
import { implantsQueryOptions } from "@/data/queries";

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
            onClick={() =>
              navigate({ to: "/implants/$implantId", params: { implantId: implant.id } })
            }
          />
        ))
      )}
    </Panel>
  );
}
