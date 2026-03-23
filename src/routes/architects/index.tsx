import { createFileRoute } from "@tanstack/react-router";
import { store } from "@/data/store";

export const Route = createFileRoute("/architects/")({
  loader: () => store.getArchitects(),
  component: ArchitectsIndex,
});

function ArchitectsIndex() {
  const architects = Route.useLoaderData();

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
