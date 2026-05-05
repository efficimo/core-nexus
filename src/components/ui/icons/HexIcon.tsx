import type { ReactElement, SVGProps } from "react";
import { z } from "zod";

// ── Schemas ───────────────────────────────────────────────────────────────────

export const PointIdSchema = z.enum([
  "C",
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "M0",
  "M1",
  "M2",
  "M3",
  "M4",
  "M5",
  "I0",
  "I1",
  "I2",
  "I3",
  "I4",
  "I5",
  "N0",
  "N1",
  "N2",
  "N3",
  "N4",
  "N5",
] as const);

const LineShapeSchema = z.object({
  type: z.literal("line"),
  pts: z.tuple([PointIdSchema, PointIdSchema]),
  opacity: z.number().min(0).max(1).optional(),
});

const PolygonShapeSchema = z.object({
  type: z.literal("polygon"),
  pts: z.tuple([PointIdSchema, PointIdSchema, PointIdSchema]).rest(PointIdSchema),
  fill: z.boolean().optional(),
  opacity: z.number().min(0).max(1).optional(),
});

const CircleShapeSchema = z.object({
  type: z.literal("circle"),
  center: PointIdSchema,
  r: z.number().positive().optional(),
  fill: z.boolean().optional(),
  opacity: z.number().min(0).max(1).optional(),
});

const PolylineShapeSchema = z.object({
  type: z.literal("polyline"),
  pts: z.tuple([PointIdSchema, PointIdSchema]).rest(PointIdSchema),
  opacity: z.number().min(0).max(1).optional(),
});

export const ShapeSchema = z.discriminatedUnion("type", [
  LineShapeSchema,
  PolygonShapeSchema,
  CircleShapeSchema,
  PolylineShapeSchema,
]);

export const HexIconDefSchema = z.object({
  shapes: z.array(ShapeSchema),
  strokeWidth: z.number().positive().optional(),
});

// ── Types inférés ─────────────────────────────────────────────────────────────

export type PointId = z.infer<typeof PointIdSchema>;
export type Shape = z.infer<typeof ShapeSchema>;
export type HexIconDef = z.infer<typeof HexIconDefSchema>;

// ── Coordonnées ───────────────────────────────────────────────────────────────

export const COORDS: Record<PointId, [number, number]> = {
  C: [10, 10],
  V0: [10, 2.5],
  V1: [16.5, 6.25],
  V2: [16.5, 13.75],
  V3: [10, 17.5],
  V4: [3.5, 13.75],
  V5: [3.5, 6.25],
  M0: [13.25, 4.375],
  M1: [16.5, 10],
  M2: [13.25, 15.625],
  M3: [6.75, 15.625],
  M4: [3.5, 10],
  M5: [6.75, 4.375],
  I0: [10, 6.25],
  I1: [13.25, 8.125],
  I2: [13.25, 11.875],
  I3: [10, 13.75],
  I4: [6.75, 11.875],
  I5: [6.75, 8.125],
  N0: [11.625, 7.1875],
  N1: [13.25, 10],
  N2: [11.625, 12.8125],
  N3: [8.375, 12.8125],
  N4: [6.75, 10],
  N5: [8.375, 7.1875],
};

// ── Rendu ─────────────────────────────────────────────────────────────────────

function toPoints(ids: readonly PointId[]): string {
  return ids.map((id) => COORDS[id].join(",")).join(" ");
}

function renderShape(s: Shape, key: number): ReactElement {
  switch (s.type) {
    case "line": {
      const [x1, y1] = COORDS[s.pts[0]];
      const [x2, y2] = COORDS[s.pts[1]];
      return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity={s.opacity} />;
    }
    case "polygon": {
      if (s.fill) {
        return (
          <polygon
            key={key}
            points={toPoints(s.pts)}
            fill="currentColor"
            stroke="none"
            opacity={s.opacity}
          />
        );
      }
      return <polygon key={key} points={toPoints(s.pts)} fill="none" strokeOpacity={s.opacity} />;
    }
    case "circle": {
      const [cx, cy] = COORDS[s.center];
      if (s.fill) {
        return (
          <circle
            key={key}
            cx={cx}
            cy={cy}
            r={s.r ?? 1}
            fill="currentColor"
            stroke="none"
            opacity={s.opacity}
          />
        );
      }
      return (
        <circle key={key} cx={cx} cy={cy} r={s.r ?? 1} fill="none" strokeOpacity={s.opacity} />
      );
    }
    case "polyline": {
      return <polyline key={key} points={toPoints(s.pts)} strokeOpacity={s.opacity} />;
    }
  }
}

// ── Composant base ────────────────────────────────────────────────────────────

export function HexIcon({
  def,
  ...props
}: { def: HexIconDef } & SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={def.strokeWidth ?? 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {def.shapes.map((s, i) => renderShape(s, i))}
    </svg>
  );
}
