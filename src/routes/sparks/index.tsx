import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { sparksQueryOptions } from "@/data/queries";

export const Route = createFileRoute("/sparks/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(sparksQueryOptions()),
  component: SparksIndex,
});

function SparksIndex() {
  const { data: sparks } = useSuspenseQuery(sparksQueryOptions());

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
