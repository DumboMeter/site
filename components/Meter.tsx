import type { CSSProperties } from "react";
import { CELLS, filled } from "@/lib/meter";

type MeterProps = {
  pct: number;
  color: string; // a CSS color or a state var, e.g. "var(--smart)"
  variant?: "mini" | "session" | "hero";
};

// Static, presentational meter (server component). Identical fill/empty box model
// lives in globals.css; this only toggles the .fill class per cell.
export default function Meter({ pct, color, variant = "mini" }: MeterProps) {
  const f = filled(pct);
  return (
    <div
      className={`meter ${variant}`}
      style={{ "--mc": color } as CSSProperties}
      aria-hidden
    >
      {Array.from({ length: CELLS }, (_, i) => (
        <span key={i} className={i < f ? "cell fill" : "cell"} />
      ))}
    </div>
  );
}
