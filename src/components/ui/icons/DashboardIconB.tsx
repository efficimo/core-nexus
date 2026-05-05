import type { SVGProps } from "react";
import { HexIcon, type HexIconDef } from "./HexIcon";

const def: HexIconDef = {
  shapes: [
    { type: "polygon", pts: ["V0", "V1", "V2", "V3", "V4", "V5"] },
    { type: "polygon", pts: ["I0", "I1", "I2", "I3", "I4", "I5"] },
    { type: "circle", center: "C", r: 0.8, fill: true },
  ],
};

export const DashboardIconB = (props: SVGProps<SVGSVGElement>) => <HexIcon def={def} {...props} />;
