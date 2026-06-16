"use client";

import { useCallback, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CELLS, filled, stateFor } from "@/lib/meter";

// Click-only. No autoplay. The meter sits still until you click it, so every
// click visibly steps it one state dumber. At Dumb, the next click runs /compact.
const STAGES = [12, 38, 60, 80, 96];
const TICK = [
  "fresh. sharp. one-shots everything.",
  "still good. cruising along.",
  "starting to forget the details...",
  "wait, what were we doing again?",
  "💀 reinventing the API you wrote 5 minutes ago.",
];

export default function HeroMeter() {
  const [pct, setPct] = useState(STAGES[0]);
  const [msg, setMsg] = useState<ReactNode>("👆 click the meter. make your AI dumber.");
  const [touched, setTouched] = useState(false);
  const stage = useRef(0);

  const bump = useCallback(() => {
    if (!touched) setTouched(true);
    if (stage.current >= STAGES.length - 1) {
      stage.current = 0;
      setPct(6);
      setMsg(
        <>
          › <b>/compact</b>. ahh, fresh context. (do it again)
        </>
      );
    } else {
      stage.current += 1;
      setPct(STAGES[stage.current]);
      setMsg("› " + TICK[stage.current]);
    }
  }, [touched]);

  const st = stateFor(pct);
  const f = filled(pct);

  return (
    <div
      className={`meterbox${touched ? "" : " cue"}`}
      role="button"
      tabIndex={0}
      aria-label="Live Claude Code status line. Click to make the meter climb toward Dumb."
      onClick={bump}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          bump();
        }
      }}
    >
      <div className="chrome">
        <i />
        <i />
        <i />
      </div>
      <div className="statusline">
        <span className="sl-ctx">
          <span className="cwd">~/my-app</span>
          <span className="branch">main</span>
        </span>
        <span className="sl-meta">
          <span className="sl-word" style={{ color: st.color }}>
            {st.label}
          </span>
          <div
            className="meter hero-meter"
            style={{ "--mc": st.color } as CSSProperties}
            aria-hidden
          >
            {Array.from({ length: CELLS }, (_, i) => (
              <span key={i} className={i < f ? "cell fill" : "cell"} />
            ))}
          </div>
          <span className="sl-pct" style={{ color: st.color }}>
            {pct}%
          </span>
          <span className="sl-skull" style={{ opacity: st.skull ? 1 : 0 }}>
            💀
          </span>
        </span>
      </div>
      <div className="ticker mono">{msg}</div>
    </div>
  );
}
