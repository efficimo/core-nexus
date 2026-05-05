import type { SVGProps } from "react";
import { HexIcon, type HexIconDef } from "./HexIcon";

const def: HexIconDef = {
  shapes: [
    {
      type: "polygon",
      pts: ["I0", "I1", "I2", "I3", "I4", "I5"],
    },
    {
      type: "polygon",
      pts: ["V0", "V1", "V2", "V3", "V4", "V5"],
    },
  ],
};

export const SigilsIcon = (props: SVGProps<SVGSVGElement>) => <HexIcon def={def} {...props} />;
