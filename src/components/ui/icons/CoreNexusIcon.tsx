import type { SVGProps } from "react";
import { HexIcon, type HexIconDef } from "./HexIcon";

const def: HexIconDef = {
  shapes: [
    { type: "polygon", pts: ["V0", "V1", "V2", "V3", "V4", "V5"] },
    { type: "polygon", pts: ["I0", "I1", "I2", "I3", "I4", "I5"] },
    { type: "line", pts: ["I0", "V0"] },
    { type: "line", pts: ["I1", "V1"] },
    { type: "line", pts: ["I2", "V2"] },
    { type: "line", pts: ["I3", "V3"] },
    { type: "line", pts: ["I4", "V4"] },
    { type: "line", pts: ["I5", "V5"] },
    { type: "circle", center: "C", r: 1.5 },
    { type: "circle", center: "C", r: 0.6, fill: true },
  ],
};

export const CoreNexusIcon = (props: SVGProps<SVGSVGElement>) => <HexIcon def={def} {...props} />;
