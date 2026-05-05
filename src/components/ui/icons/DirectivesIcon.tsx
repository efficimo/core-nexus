import type { SVGProps } from "react";
import { HexIcon, type HexIconDef } from "./HexIcon";

const def: HexIconDef = {
  shapes: [
    {
      type: "line",
      pts: ["N4", "M4"],
    },
    {
      type: "line",
      pts: ["N5", "M5"],
    },
    {
      type: "line",
      pts: ["N0", "M0"],
    },
    {
      type: "line",
      pts: ["N1", "M1"],
    },
    {
      type: "line",
      pts: ["N2", "M2"],
    },
    {
      type: "line",
      pts: ["N3", "M3"],
    },
    {
      type: "polygon",
      pts: ["V0", "V5", "V4", "V3", "V2", "V1"],
    },
    {
      type: "circle",
      center: "C",
      r: 3.25,
    },
  ],
};

export const DirectivesIcon = (props: SVGProps<SVGSVGElement>) => <HexIcon def={def} {...props} />;
