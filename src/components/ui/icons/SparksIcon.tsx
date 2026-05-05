import type { SVGProps } from "react";
import { HexIcon, type HexIconDef } from "./HexIcon";

const def: HexIconDef = {
  shapes: [
    {
      type: "polygon",
      pts: ["V0", "V5", "V4", "V3", "V2", "V1"],
    },
    {
      type: "line",
      pts: ["M5", "I5"],
    },
    {
      type: "line",
      pts: ["I5", "I2"],
    },
    {
      type: "line",
      pts: ["I2", "M2"],
    },
    {
      type: "polygon",
      pts: ["I0", "C", "I1"],
      fill: true,
    },
    {
      type: "polygon",
      pts: ["C", "I4", "I3"],
      fill: true,
    },
  ],
};

export const SparksIcon = (props: SVGProps<SVGSVGElement>) => <HexIcon def={def} {...props} />;
