import { createFileRoute } from "@tanstack/react-router";
import { store } from "@/data/store";

export const Route = createFileRoute("/sparks/$sparkId")({
  loader: ({ params }) => store.getSpark(params.sparkId),
  component: SparkDetail,
});

function SparkDetail() {
  const spark = Route.useLoaderData();

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