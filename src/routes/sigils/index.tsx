import { createFileRoute } from "@tanstack/react-router";
import { store } from "@/data/store";

export const Route = createFileRoute("/sigils/")({
  loader: () => store.getSigils(),
  component: SigilsIndex,
});

function SigilsIndex() {
  const sigils = Route.useLoaderData();

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