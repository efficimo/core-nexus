import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArchitectesIcon, Badge, EmptyState, ListRow, Panel, Tag } from "@/components/ui";
import { architectQueryOptions, sigilsByArchitectQueryOptions } from "@/data/queries";
import styles from "../detail.module.css";

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
    <div className={styles.stack}>
      <Panel title={architect.name} variant="accent">
        <div className={styles.body}>
          <div className={styles.row}>
            <Badge variant="accent">{architect.class}</Badge>
            <Badge>Niveau {architect.level}</Badge>
          </div>
          <p className={styles.lore}>{architect.title}</p>
          <p className={styles.description}>{architect.lore}</p>
          {architect.quote && <p className={styles.quote}>« {architect.quote} »</p>}
          {architect.skills.length > 0 && (
            <div className={styles.tags}>
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
