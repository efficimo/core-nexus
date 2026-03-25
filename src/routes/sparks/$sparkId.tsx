import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { sparkQueryOptions } from "@/data/queries";

export const Route = createFileRoute("/sparks/$sparkId")({
  loader: ({ context: { queryClient }, params: { sparkId } }) =>
    queryClient.ensureQueryData(sparkQueryOptions(sparkId)),
  component: SparkDetail,
});

function SparkDetail() {
  const { sparkId } = Route.useParams();
  const { data: spark } = useSuspenseQuery(sparkQueryOptions(sparkId));

  if (!spark) {
    return <p>Spark introuvable.</p>;
  }

  return (
    <div>
      <h1>{spark.name}</h1>
      <p>{spark.description}</p>
    </div>
  );
}
