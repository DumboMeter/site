import { ImageResponse } from "next/og";

export const alt = "dumbometer · know when your AI gets dumb";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Faux climbing meter, Smart -> Dumb, for the share card.
const RAMP = [
  "#5dff57", "#5dff57", "#5dff57", "#9be34a", "#9be34a",
  "#ffd23f", "#ffd23f", "#ff7a1e", "#ff7a1e", "#ff2e2e",
];
const FILLED = 10;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0b0d",
          color: "#f3f1e9",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 30 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              background: "#c6ff3a",
              boxShadow: "0 0 28px #c6ff3a",
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>dumbometer</div>
        </div>

        <div style={{ fontSize: 94, fontWeight: 800, lineHeight: 1, letterSpacing: -3, maxWidth: 1000 }}>
          Know when your AI gets dumb.
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 48 }}>
          {Array.from({ length: 14 }).map((_, i) => {
            const on = i < FILLED;
            const c = RAMP[Math.min(i, RAMP.length - 1)];
            return (
              <div
                key={i}
                style={{
                  width: 56,
                  height: 42,
                  borderRadius: 5,
                  border: `2px solid ${on ? c : "#ffffff22"}`,
                  background: on ? c : "transparent",
                }}
              />
            );
          })}
        </div>

        <div style={{ fontSize: 26, color: "#9a9c96", marginTop: 40, fontFamily: "monospace" }}>
          free · MIT · zero tokens · never crashes
        </div>
      </div>
    ),
    { ...size }
  );
}
