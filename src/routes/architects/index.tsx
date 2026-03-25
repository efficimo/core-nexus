import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { architectsQueryOptions } from "@/data/queries";

export const Route = createFileRoute("/architects/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(architectsQueryOptions()),
  component: ArchitectsIndex,
});

function ArchitectsIndex() {
  const { data: architects } = useSuspenseQuery(architectsQueryOptions());

  return (
    <div>
      <h1>Pixel Architects</h1>
      {architects.length === 0 ? (
        <p>Aucun Architecte enregistre.</p>
      ) : (
        <ul>
          {architects.map((architect) => (
            <li key={architect.id}>{architect.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
