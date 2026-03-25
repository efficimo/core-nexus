import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { implantsQueryOptions } from "@/data/queries";

export const Route = createFileRoute("/implants/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(implantsQueryOptions()),
  component: ImplantsIndex,
});

function ImplantsIndex() {
  const { data: implants } = useSuspenseQuery(implantsQueryOptions());

  return (
    <div>
      <h1>Implants</h1>
      {implants.length === 0 ? (
        <p>Aucun Implant pour le moment.</p>
      ) : (
        <ul>
          {implants.map((implant) => (
            <li key={implant.id}>{implant.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
