"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CELLS, filled, stateFor } from "@/lib/meter";

const TICKERS = [
  "› parsing a 2,000-line file...",
  '› "remind me what we were doing"',
  "› re-reading the whole repo, again",
  "› inventing an API that does not exist",
  "› forgetting the function from 3 messages ago",
];

// The hero product proof: a live status line whose meter climbs Smart -> Dumb,
// resets on /compact, and spikes to Dumb on click. Respects reduced-motion.
export default function HeroMeter() {
  const [pct, setPct] = useState(4);
  const [ticker, setTicker] = useState<ReactNode>("› idle. feed me a 4-hour refactor.");

  const pRef = useRef(4);
  const forced = useRef(false);
  const galaxy = useRef(false);
  const reduced = useRef(false);
  const ti = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const set = useCallback((p: number) => {
    pRef.current = p;
    setPct(p);
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }, []);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced.current) {
      set(78);
      setTicker(
        <>
          › <b>Cooked</b>. reduced-motion mode.
        </>
      );
      return;
    }

    galaxy.current = Math.random() < 0.05;
    set(4);

    const loop = () => {
      if (forced.current) {
        later(loop, 300);
        return;
      }
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
          if (forced.current) {
            later(loop, 300);
            return;
          }
          galaxy.current = Math.random() < 0.05;
          set(3 + Math.floor(Math.random() * 5));
          setTicker(
            galaxy.current
              ? "› fresh session. galaxy brain online."
              : "› fresh session. context flushed."
          );
          later(loop, 1200);
        }, 1600);
        return;
      }

      set(next);
      if (next > 30 && next < 92 && Math.random() < 0.35) {
        setTicker(TICKERS[ti.current++ % TICKERS.length]);
      }
      later(loop, 600 + Math.random() * 300);
    };

    later(loop, 800);

    const list = timers.current;
    return () => {
      list.forEach(clearTimeout);
    };
  }, [set, later]);

  const spike = useCallback(() => {
    if (reduced.current || forced.current) return;
    forced.current = true;
    galaxy.current = false;
    set(99);
    setTicker(
      <>
        › <b>💀 maxed out.</b> /compact, champ.
      </>
    );
    later(() => {
      set(4);
      setTicker("› reset. (you did that on purpose.)");
      forced.current = false;
    }, 1600);
  }, [set, later]);

  const st = stateFor(pct);
  const label = galaxy.current && pct < 25 ? "🌌 galaxy brain" : st.label;
  const f = filled(pct);

  return (
    <div
      className="meterbox"
      role="img"
      tabIndex={0}
      aria-label="Live demo of a Claude Code status line. dumbometer adds the meter showing context fill. Click to spike to Dumb."
      onClick={spike}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          spike();
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
            {label}
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
      <div className="hint mono">
        ↑ click to spike. that is the meter dumbometer adds to your status line.
      </div>
    </div>
  );
}
