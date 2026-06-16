"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CELLS, filled, stateFor } from "@/lib/meter";

// Click targets: each click lands squarely in the next state, getting dumber.
const STAGES = [
  { pct: 12, t: "fresh. sharp. one-shots everything." },
  { pct: 38, t: "still good. cruising." },
  { pct: 60, t: "starting to forget the details..." },
  { pct: 80, t: "wait, what were we doing again?" },
  { pct: 96, t: "💀 reinventing the API you wrote 5 minutes ago." },
];

const AUTO_TICKERS = [
  "› parsing a 2,000-line file...",
  '› "remind me what we were doing"',
  "› re-reading the whole repo, again",
  "› inventing an API that does not exist",
];

function stageFromPct(p: number) {
  if (p >= 90) return 4;
  if (p >= 70) return 3;
  if (p >= 50) return 2;
  if (p >= 25) return 1;
  return 0;
}

// The hero product proof + toy: autoplays a climbing session until you touch it,
// then each click bumps the meter one state dumber. At Dumb, the next click
// runs /compact and flushes back to Smart. Respects reduced-motion.
export default function HeroMeter() {
  const [pct, setPct] = useState(4);
  const [ticker, setTicker] = useState<ReactNode>("› idle. click me to make your AI dumber.");

  const pRef = useRef(4);
  const manual = useRef(false);
  const stage = useRef(0);
  const reduced = useRef(false);
  const ai = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const set = useCallback((p: number) => {
    pRef.current = p;
    setPct(p);
  }, []);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced.current) {
      set(78);
      setTicker(
        <>
          › <b>Cooked</b>. click to make it dumber.
        </>
      );
      return;
    }

    set(4);

    const loop = () => {
      if (manual.current) return;
      const next =
        pRef.current + (Math.random() < 0.25 ? 1 : 2 + Math.floor(Math.random() * 3));

      if (next >= 100) {
        set(100);
        setTicker(
          <>
            › <b>/compact</b>. flushing the rot...
          </>
        );
        later(() => {
          if (manual.current) return;
          set(4);
          setTicker("› fresh session. context flushed.");
          later(loop, 1200);
        }, 1600);
        return;
      }

      set(next);
      if (next > 30 && next < 92 && Math.random() < 0.35) {
        setTicker(AUTO_TICKERS[ai.current++ % AUTO_TICKERS.length]);
      }
      later(loop, 600 + Math.random() * 300);
    };

    later(loop, 800);

    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, [set, later]);

  const bump = useCallback(() => {
    if (reduced.current) return;
    if (!manual.current) {
      manual.current = true;
      clearTimers();
      stage.current = stageFromPct(pRef.current);
    }
    if (stage.current >= STAGES.length - 1) {
      // already Dumb -> /compact flush back to Smart
      stage.current = 0;
      set(6);
      setTicker(
        <>
          › <b>/compact</b>. ahh, fresh context.
        </>
      );
    } else {
      stage.current += 1;
      const s = STAGES[stage.current];
      set(s.pct);
      setTicker("› " + s.t);
    }
  }, [set, clearTimers]);

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
