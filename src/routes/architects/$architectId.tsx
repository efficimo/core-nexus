import { ArchitectesIcon, Badge, EmptyState, ListRow, Panel, Tag } from "@core-nexus/components/ui";
import { architectQueryOptions, sigilsByArchitectQueryOptions } from "@core-nexus/data/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/architects/$architectId")({
  loader: ({ context: { queryClient }, params: { architectId } }) =>
    Promise.all([
      queryClient.ensureQueryData(architectQueryOptions(architectId)),
      queryClient.ensureQueryData(sigilsByArchitectQueryOptions(architectId)),
    ]),
  component: ArchitectDetail,
});

function ArchitectDetail() {
  const { architectId } = Route.useParams();
  const { data: architect } = useSuspenseQuery(architectQueryOptions(architectId));
  const { data: sigils } = useSuspenseQuery(sigilsByArchitectQueryOptions(architectId));

  if (!architect) {
    return <EmptyState label="Architecte introuvable." icon={<ArchitectesIcon />} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Panel title={architect.name} variant="accent">
        <div className="flex flex-col gap-[0.6rem]">
          <div className="flex items-center gap-[0.5rem] flex-wrap">
            <Badge variant="accent">{architect.class}</Badge>
            <Badge>Niveau {architect.level}</Badge>
          </div>
          <p className="text-text-dim italic leading-[1.6]">{architect.title}</p>
          <p className="text-text-dim leading-[1.6]">{architect.lore}</p>
          {architect.quote && (
            <p className="text-text-faint text-[0.45rem] tracking-[0.1em]">« {architect.quote} »</p>
          )}
          {architect.skills.length > 0 && (
            <div className="flex gap-[0.4rem] flex-wrap">
              {architect.skills.map((s) => (
                <Tag key={s.skillId}>
                  {s.skillId} {s.level}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </Panel>

      {sigils.length > 0 && (
        <Panel title="SIGILS">
          {sigils.map((sigil) => (
            <ListRow
              key={sigil.id}
              label={`${sigil.icon} ${sigil.name}`}
              sub={sigil.description}
              aside={<Badge variant="purple">{sigil.rarity}</Badge>}
            />
          ))}
        </Panel>
      )}
    </div>
  );
}
