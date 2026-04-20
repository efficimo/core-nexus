import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { EmptyState, ImplantsIcon, Panel, Tag } from "@/components/ui";
import { implantQueryOptions } from "@/data/queries";
import styles from "../detail.module.css";

export const Route = createFileRoute("/implants/$implantId")({
  loader: ({ context: { queryClient }, params: { implantId } }) =>
    queryClient.ensureQueryData(implantQueryOptions(implantId)),
  component: ImplantDetail,
});

function ImplantDetail() {
  const { implantId } = Route.useParams();
  const { data: implant } = useSuspenseQuery(implantQueryOptions(implantId));

  if (!implant) {
    return <EmptyState label="Implant introuvable." icon={<ImplantsIcon />} />;
  }

  return (
    <Panel title={implant.name}>
      <div className={styles.body}>
        <p className={styles.description}>{implant.description}</p>
        {implant.tags.length > 0 && (
          <div className={styles.tags}>
            {implant.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
