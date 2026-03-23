import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <h1>Core Nexus</h1>
      <p>Le quartier general des Pixel Architects.</p>
    </div>
  );
}
