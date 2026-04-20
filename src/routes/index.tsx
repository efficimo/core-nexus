import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { Panel } from "@/components/ui";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const grid: CSSProperties = { display: "flex", flexWrap: "wrap", gap: "0.9rem" };
const wide: CSSProperties = { flex: "2 1 540px" };
const cell: CSSProperties = { flex: "1 1 260px" };

function Dashboard() {
  return (
    <div style={grid}>
      <Panel title="Vue d'ensemble" style={wide} />
      <Panel title="Activité récente" style={cell} />
      <Panel title="Sparks actifs" variant="accent" style={cell} />
      <Panel title="Synchronisation complète" variant="success" style={cell} />
      <Panel title="Implants déployés" style={cell} />
      <Panel title="Sigils vérifiés" variant="success" style={cell} />
      <Panel title="Erreur de connexion" variant="error" style={cell} />
      <Panel title="Module non disponible" variant="disabled" style={cell} />
      <Panel title="Alertes système" variant="warn" style={wide} />
    </div>
  );
}
