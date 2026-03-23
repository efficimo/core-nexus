import { createFileRoute } from "@tanstack/react-router";
import { store } from "@/data/store";

export const Route = createFileRoute("/sparks/")({
  loader: () => store.getSparks(),
  component: SparksIndex,
});

function SparksIndex() {
  const sparks = Route.useLoaderData();

  return (
    <div>
      <h1>Sparks</h1>
      {sparks.length === 0 ? (
        <p>Aucune Spark pour le moment.</p>
      ) : (
        <ul>
          {sparks.map((spark) => (
            <li key={spark.id}>{spark.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
