import { Badge, EmptyState, Panel, SparksIcon, Tag } from "@core-nexus/components/ui";
import { sparkQueryOptions } from "@core-nexus/data/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
      <div className="flex flex-col gap-[0.6rem]">
        <div className="flex items-center gap-[0.5rem] flex-wrap">
          <Badge variant={statusVariant[spark.status]}>{spark.status}</Badge>
        </div>
        <p className="text-text-dim leading-[1.6]">{spark.description}</p>
        {spark.tags.length > 0 && (
          <div className="flex gap-[0.4rem] flex-wrap">
            {spark.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
