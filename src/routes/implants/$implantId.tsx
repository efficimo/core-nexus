import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { implantQueryOptions } from "@/data/queries";

export const Route = createFileRoute("/implants/$implantId")({
  loader: ({ context: { queryClient }, params: { implantId } }) =>
    queryClient.ensureQueryData(implantQueryOptions(implantId)),
  component: ImplantDetail,
});

function ImplantDetail() {
  const { implantId } = Route.useParams();
  const { data: implant } = useSuspenseQuery(implantQueryOptions(implantId));

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
