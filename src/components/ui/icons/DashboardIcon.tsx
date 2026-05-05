import type { SVGProps } from "react";
import { HexIcon, type HexIconDef } from "./HexIcon";

const def: HexIconDef = {
  shapes: [
    {
      type: "polygon",
      pts: ["V0", "V1", "V2", "V3", "V4", "V5"],
    },
    {
      type: "polygon",
      pts: ["V5", "I5", "N5", "M5"],
      fill: true,
    },
    {
      type: "polygon",
      pts: ["N0", "M0", "V1", "I1"],
      fill: true,
    },
    {
      type: "polygon",
      pts: ["I2", "V2", "M2", "N2"],
      fill: true,
    },
    {
      type: "polygon",
      pts: ["V4", "I4", "N3", "M3"],
      fill: true,
    },
  ],
};

export const DashboardIcon = (props: SVGProps<SVGSVGElement>) => <HexIcon def={def} {...props} />;
