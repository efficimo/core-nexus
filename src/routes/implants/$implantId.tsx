import { createFileRoute } from "@tanstack/react-router";
import { store } from "@/data/store";

export const Route = createFileRoute("/implants/$implantId")({
  loader: ({ params }) => store.getImplant(params.implantId),
  component: ImplantDetail,
});

function ImplantDetail() {
  const implant = Route.useLoaderData();

  if (!implant) {
    return <p>Implant introuvable.</p>;
  }

  return (
    <div>
      <h1>{implant.name}</h1>
      <p>{implant.description}</p>
    </div>
  );
}