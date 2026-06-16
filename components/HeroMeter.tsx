"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CELLS, filled, stateFor } from "@/lib/meter";

// Click targets: each click lands squarely in the next state, getting dumber.
const STAGES = [12, 38, 60, 80, 96];
const STAGE_TICK = [
  "fresh. sharp. one-shots everything.",
  "still good. cruising.",
  "starting to forget the details...",
  "wait, what were we doing again?",
  "💀 reinventing the API you wrote 5 minutes ago.",
];
const AUTO_TICKERS = [
  "› parsing a 2,000-line file...",
  '› "remind me what we were doing"',
  "› re-reading the whole repo, again",
  "› inventing an API that does not exist",
];

// highest STAGES index whose value is <= pct
function stageAt(pct: number) {
  let i = 0;
  for (let k = 0; k < STAGES.length; k++) if (STAGES[k] <= pct) i = k;
  return i;
}

export default function HeroMeter() {
  const [pct, setPct] = useState(8);
  const [ticker, setTicker] = useState<ReactNode>("› click me. make your AI dumber.");

  const pRef = useRef(8);
  const auto = useRef(true); // autoplay until first interaction
  const stage = useRef(0);
  const reduced = useRef(false);
  const ai = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apply = useCallback((p: number) => {
    pRef.current = p;
    setPct(p);
  }, []);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced.current) {
      apply(78);
      setTicker(
        <>
          › <b>Cooked</b>. click to make it dumber.
        </>
      );
      return;
    }

    const tick = () => {
      if (!auto.current) return;
      const next = pRef.current + (Math.random() < 0.3 ? 1 : 2 + Math.floor(Math.random() * 3));
      if (next >= 100) {
        apply(100);
        setTicker(
          <>
            › <b>/compact</b>. flushing the rot...
          </>
        );
        timer.current = setTimeout(() => {
          if (!auto.current) return;
          apply(6);
          setTicker("› fresh session. context flushed.");
          timer.current = setTimeout(tick, 1100);
        }, 1500);
        return;
      }
      apply(next);
      if (next > 30 && next < 92 && Math.random() < 0.35) {
        setTicker(AUTO_TICKERS[ai.current++ % AUTO_TICKERS.length]);
      }
      timer.current = setTimeout(tick, 650 + Math.random() * 250);
    };

    timer.current = setTimeout(tick, 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [apply]);

  const bump = useCallback(() => {
    if (reduced.current) return;
    // first interaction: stop autoplay hard, sync to the current state
    if (auto.current) {
      auto.current = false;
      if (timer.current) clearTimeout(timer.current);
      stage.current = stageAt(pRef.current);
    }
    // at Dumb -> /compact flush; otherwise step one state dumber
    if (stage.current >= STAGES.length - 1 && pRef.current >= 90) {
      stage.current = 0;
      apply(6);
      setTicker(
        <>
          › <b>/compact</b>. ahh, fresh context.
        </>
      );
    } else {
      stage.current = Math.min(STAGES.length - 1, stage.current + 1);
      apply(STAGES[stage.current]);
      setTicker("› " + STAGE_TICK[stage.current]);
    }
  }, [apply]);

  const st = stateFor(pct);
  const f = filled(pct);

  return (
    <div
      className="meterbox"
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
      <div className="ticker mono">{ticker}</div>
      <div className="hint mono">👆 click the status line. make your AI dumber.</div>
    </div>
  );
}
