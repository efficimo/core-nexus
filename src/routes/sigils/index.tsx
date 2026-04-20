import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Badge, EmptyState, ListRow, Panel, SigilsIcon } from "@/components/ui";
import { sigilsQueryOptions } from "@/data/queries";
import { rarityVariant } from "./variants";

export const Route = createFileRoute("/sigils/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(sigilsQueryOptions()),
  component: SigilsIndex,
});

function SigilsIndex() {
  const { data: sigils } = useSuspenseQuery(sigilsQueryOptions());

  return (
    <Panel title="SIGILS">
      {sigils.length === 0 ? (
        <EmptyState label="Aucun Sigil pour le moment." icon={<SigilsIcon />} />
      ) : (
        sigils.map((sigil) => (
          <ListRow
            key={sigil.id}
            label={`${sigil.icon} ${sigil.name}`}
            sub={sigil.description}
            aside={<Badge variant={rarityVariant[sigil.rarity]}>{sigil.rarity}</Badge>}
          />
        ))
      )}
    </Panel>
  );
}
