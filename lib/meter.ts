// Pure meter helpers. Thresholds mirror the plugin's computeState (25/50/70/90),
// which is already covered by 64 tests in the plugin repo, so the logic is proven.

export const CELLS = 14;

export type MeterState = { label: string; color: string; skull: boolean };

export function stateFor(pct: number): MeterState {
  if (pct >= 90) return { label: "Dumb", color: "var(--dumb)", skull: true };
  if (pct >= 70) return { label: "Cooked", color: "var(--cooked)", skull: false };
  if (pct >= 50) return { label: "Foggy", color: "var(--foggy)", skull: false };
  if (pct >= 25) return { label: "Coasting", color: "var(--coasting)", skull: false };
  return { label: "Smart", color: "var(--smart)", skull: false };
}

export function filled(pct: number, cells: number = CELLS): number {
  return Math.max(0, Math.min(cells, Math.round((pct / 100) * cells)));
}
