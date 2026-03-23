import { createFileRoute } from "@tanstack/react-router";
import { store } from "@/data/store";

export const Route = createFileRoute("/implants/")({
  loader: () => store.getImplants(),
  component: ImplantsIndex,
});

function ImplantsIndex() {
  const implants = Route.useLoaderData();

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