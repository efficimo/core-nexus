import type { ReactElement } from "react";
import { Button } from "./Button";

type Props = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  onClear?: () => void;
  display?: string | number;
};

export function Slider({ min, max, step, value, onChange, onClear, display }: Props): ReactElement {
  return (
    <div className="flex items-center gap-[0.5rem]">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className="flex-1 [accent-color:var(--accent)] cursor-pointer"
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="font-mono text-[0.58rem] text-text-dim min-w-[2.2rem] text-right">
        {display ?? value}
      </span>
      {onClear && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          ✕
        </Button>
      )}
    </div>
  );
}
