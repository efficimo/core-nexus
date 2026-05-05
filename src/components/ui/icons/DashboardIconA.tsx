import type { SVGProps } from "react";
import { HexIcon, type HexIconDef } from "./HexIcon";

const def: HexIconDef = {
  shapes: [
    { type: "polygon", pts: ["V0", "V1", "V2", "V3", "V4", "V5"] },
    { type: "line", pts: ["C", "V0"] },
    { type: "line", pts: ["C", "V2"] },
    { type: "line", pts: ["C", "V4"] },
    { type: "circle", center: "C", r: 0.8, fill: true },
  ],
};

export const DashboardIconA = (props: SVGProps<SVGSVGElement>) => <HexIcon def={def} {...props} />;
