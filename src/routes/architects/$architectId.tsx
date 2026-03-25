import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { architectQueryOptions, sigilsByArchitectQueryOptions } from "@/data/queries";

export const Route = createFileRoute("/architects/$architectId")({
  loader: ({ context: { queryClient }, params: { architectId } }) =>
    Promise.all([
      queryClient.ensureQueryData(architectQueryOptions(architectId)),
      queryClient.ensureQueryData(sigilsByArchitectQueryOptions(architectId)),
    ]),
  component: ArchitectDetail,
});

function ArchitectDetail() {
  const { architectId } = Route.useParams();
  const { data: architect } = useSuspenseQuery(architectQueryOptions(architectId));
  const { data: sigils } = useSuspenseQuery(sigilsByArchitectQueryOptions(architectId));

  if (!architect) {
    return <p>Architecte introuvable.</p>;
  }

  return (
    <div>
      <h1>{architect.name}</h1>
      <p>{architect.title}</p>
      <p>Classe : {architect.class}</p>
      <p>Niveau : {architect.level}</p>
      <p>{architect.lore}</p>
      {sigils.length > 0 && (
        <section>
          <h2>Sigils</h2>
          <ul>
            {sigils.map((s) => (
              <li key={s.id}>
                {s.icon} {s.name}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
