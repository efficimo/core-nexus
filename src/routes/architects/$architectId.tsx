import { createFileRoute } from "@tanstack/react-router";
import { store } from "@/data/store";

export const Route = createFileRoute("/architects/$architectId")({
  loader: async ({ params }) => {
    const [architect, sigils] = await Promise.all([
      store.getArchitect(params.architectId),
      store.getSigilsByArchitect(params.architectId),
    ]);
    return { architect, sigils };
  },
  component: ArchitectDetail,
});

function ArchitectDetail() {
  const { architect, sigils } = Route.useLoaderData();

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