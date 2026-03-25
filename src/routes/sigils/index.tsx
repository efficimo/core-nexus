import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { sigilsQueryOptions } from "@/data/queries";

export const Route = createFileRoute("/sigils/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(sigilsQueryOptions()),
  component: SigilsIndex,
});

function SigilsIndex() {
  const { data: sigils } = useSuspenseQuery(sigilsQueryOptions());

  return (
    <div>
      <h1>Sigils</h1>
      {sigils.length === 0 ? (
        <p>Aucun Sigil pour le moment.</p>
      ) : (
        <ul>
          {sigils.map((sigil) => (
            <li key={sigil.id}>
              {sigil.icon} {sigil.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
