import type { SVGProps } from "react";
import { HexIcon, type HexIconDef } from "./HexIcon";

const def: HexIconDef = {
  shapes: [
    {
      type: "polygon",
      pts: ["I0", "I5", "I4", "I3", "I2", "I1"],
    },
    {
      type: "polygon",
      pts: ["M5", "N5", "I0", "N0", "M0", "V0"],
      fill: true,
    },
    {
      type: "polygon",
      pts: ["N1", "M1", "V2", "M2", "N2", "I2"],
      fill: true,
    },
    {
      type: "polygon",
      pts: ["N3", "M3", "V4", "M4", "N4", "I4"],
      fill: true,
    },
    {
      type: "circle",
      center: "V5",
      r: 1.5,
      fill: true,
    },
    {
      type: "circle",
      center: "V1",
      r: 1.5,
      fill: true,
    },
    {
      type: "circle",
      center: "V3",
      r: 1.5,
      fill: true,
    },
  ],
};

export const ImplantsIcon = (props: SVGProps<SVGSVGElement>) => <HexIcon def={def} {...props} />;
