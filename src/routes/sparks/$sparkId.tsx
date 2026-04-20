import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Badge, EmptyState, Panel, SparksIcon, Tag } from "@/components/ui";
import { sparkQueryOptions } from "@/data/queries";
import styles from "../detail.module.css";
import { statusVariant } from "./variants";

export const Route = createFileRoute("/sparks/$sparkId")({
  loader: ({ context: { queryClient }, params: { sparkId } }) =>
    queryClient.ensureQueryData(sparkQueryOptions(sparkId)),
  component: SparkDetail,
});

function SparkDetail() {
  const { sparkId } = Route.useParams();
  const { data: spark } = useSuspenseQuery(sparkQueryOptions(sparkId));

  if (!spark) {
    return <EmptyState label="Spark introuvable." icon={<SparksIcon />} />;
  }

  return (
    <Panel title={spark.name}>
      <div className={styles.body}>
        <div className={styles.row}>
          <Badge variant={statusVariant[spark.status]}>{spark.status}</Badge>
        </div>
        <p className={styles.description}>{spark.description}</p>
        {spark.tags.length > 0 && (
          <div className={styles.tags}>
            {spark.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
