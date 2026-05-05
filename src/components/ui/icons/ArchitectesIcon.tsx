import type { SVGProps } from "react";
import { HexIcon, type HexIconDef } from "./HexIcon";

const def: HexIconDef = {
  shapes: [
    {
      type: "polygon",
      pts: ["V5", "I5", "C", "I1", "V1", "M1", "V2", "M2", "V3", "M3", "V4", "M4"],
      fill: true,
    },
    {
      type: "circle",
      center: "V0",
      r: 2.7,
      fill: true,
    },
  ],
};

export const ArchitectesIcon = (props: SVGProps<SVGSVGElement>) => <HexIcon def={def} {...props} />;
