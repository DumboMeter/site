import type { Metadata } from "next";
import CopyButton from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "You're in · dumbometer",
  robots: { index: false, follow: false },
};

const PRO_INSTALL = `/plugin marketplace add DumboMeter/dumbometer-pro
/plugin install dumbometer-pro
/dumbometer-pro:setup`;

const PRO_ENV = `DUMBOMETER_THEME=matrix
DUMBOMETER_ROAST=1`;

export default function Success() {
  return (
    <main className="wrap" style={{ maxWidth: 720, padding: "120px 24px 96px" }}>
      <span className="section-label pink">big dumb energy</span>
      <h1 style={{ fontSize: "clamp(36px,7vw,64px)" }}>You&apos;re in. 💀</h1>

      <p className="lead" style={{ marginTop: 18 }}>
        Thanks for the tip. Check your email for the GitHub invite to{" "}
        <code>DumboMeter/dumbometer-pro</code>. Accept it, then run these in Claude Code:
      </p>

      <div className="install-block">
        <code className="mono">{PRO_INSTALL}</code>
        <CopyButton text={PRO_INSTALL} label="COPY ALL" />
      </div>

      <p className="lead" style={{ marginTop: 28 }}>
        Then switch on the perks with environment variables and restart Claude Code.
        Themes: default, matrix, vaporwave, mono, hazard.
      </p>

      <div className="install-block">
        <code className="mono">{PRO_ENV}</code>
        <CopyButton text={PRO_ENV} label="COPY" />
      </div>

      <p className="trust-line mono" style={{ marginTop: 32 }}>
        <a
          href="/"
          style={{ color: "var(--acid)", borderBottom: "1px solid var(--acid)", textDecoration: "none" }}
        >
          ← back to dumbometer
        </a>
      </p>
    </main>
  );
}
