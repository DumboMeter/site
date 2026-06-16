import Meter from "@/components/Meter";
import HeroMeter from "@/components/HeroMeter";
import CopyButton from "@/components/CopyButton";
import SiteEffects from "@/components/SiteEffects";

const SITE = "https://dumbometer.xyz";
const GH = "https://github.com/MaximoCorrea1/dumbometer";
const INSTALL = `/plugin marketplace add MaximoCorrea1/dumbometer
/plugin install dumbometer
/dumbometer:setup`;
const STEPS = INSTALL.split("\n");
// $9 Big Dumb Energy -> Polar checkout (server route keeps the token server-side).
const CHECKOUT = "/api/checkout?products=843fdc28-55e3-43d5-9924-2af444e412f4";

const SESSION = [
  { label: "Smart", color: "var(--smart)", pct: 12, note: "fresh context. agent is sharp." },
  { label: "Coasting", color: "var(--coasting)", pct: 45, note: "still solid. keep going." },
  { label: "Cooked", color: "var(--cooked)", pct: 78, note: "starting to drift. plan your /compact." },
  { label: "Dumb 💀", color: "var(--dumb)", pct: 96, note: "re-inventing APIs. /compact now." },
];

const STATES = [
  { nm: "Smart", color: "var(--smart)", rg: "0-24%", pct: 14 },
  { nm: "Coasting", color: "var(--coasting)", rg: "25-49%", pct: 37 },
  { nm: "Foggy", color: "var(--foggy)", rg: "50-69%", pct: 61 },
  { nm: "Cooked", color: "var(--cooked)", rg: "70-89%", pct: 82 },
  { nm: "Dumb 💀", color: "var(--dumb)", rg: "90-100%", pct: 96 },
];

// FAQ drives both the visible section and the FAQPage JSON-LD (DRY).
const FAQ = [
  { q: "What is dumbometer?", a: "A Claude Code status-line gauge that shows how full your context window is, from Smart to Dumb, so you /compact before quality drops." },
  { q: "What is context rot?", a: "As a session fills the context window, the model spreads its attention thinner and starts making mistakes it would not make fresh. dumbometer measures the cause, context percent, so you see it coming." },
  { q: "Does it cost tokens?", a: "No. It reads a number Claude Code already computed and runs locally on every render. Zero tokens, zero network, zero cost." },
  { q: "Will it slow down or break Claude Code?", a: "No. The hot path is synchronous and sub-millisecond, and every failure path falls back to safe output and exits clean. 64 tests cover the never-crash contract." },
  { q: "Does it work with the 1M context window?", a: "Yes. It reads the real window size, 200k or 1M, and shows the percentage either way." },
  { q: "How do I install it?", a: "Three commands: /plugin marketplace add MaximoCorrea1/dumbometer, /plugin install dumbometer, /dumbometer:setup. It is free and MIT." },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "dumbometer",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Cross-platform (Node.js)",
      description:
        "A Claude Code status-line gauge that shows how full your context window is, from Smart to Dumb, so you /compact before quality drops. Zero tokens, never crashes.",
      url: SITE,
      offers: [
        { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
        { "@type": "Offer", price: "9", priceCurrency: "USD", name: "Big Dumb Energy" },
      ],
      license: "https://opensource.org/license/mit",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      <nav>
        <div className="brand">
          <span className="badge" role="img" aria-label="dumbometer mascot" />
          dumbometer
        </div>
        <a className="navlink" href={GH}>
          ★ GitHub
        </a>
      </nav>

      <header className="hero wrap">
        <div className="hero-col">
          <div className="hero-top">
            <span className="hero-mascot" role="img" aria-label="dumbometer mascot, a derpy gauge face" />
            <span className="hero-word">dumbometer</span>
          </div>

          <div className="hero-eyebrow">
            <span className="eyebrow mono">a meter for Claude Code</span>
          </div>

          <div className="hero-h1">
            <h1>Know when your AI gets dumb.</h1>
          </div>

          <div className="hero-sub">
            <p className="hero-sub-text">
              A live meter in your Claude Code status line that shows how full your context window is,
              so you <code>/compact</code> before your agent forgets your code.
            </p>
          </div>

          <div className="hero-meterbox">
            <HeroMeter />
          </div>

          <div className="hero-cta">
            <div className="cta-row">
              <a className="btn-primary" href="#install">
                Install free →
              </a>
              <a className="btn-ghost" href={GH}>
                ★ GitHub →
              </a>
            </div>
          </div>

          <div className="hero-trust">
            <p className="trust-line mono">free · MIT · zero tokens · 64 tests · never crashes</p>
          </div>
        </div>
      </header>

      <section className="wrap reveal">
        <span className="section-label cyan">a real session</span>
        <h2>What it looks like over time.</h2>
        <p className="lead">
          A typical coding session. The meter climbs in your status line. You see it coming before the
          answers go bad.
        </p>

        <div className="session-strip">
          {SESSION.map((s) => (
            <div className="session-step" key={s.label}>
              <span className="ss-ctx">~/my-app ⎇ main</span>
              <span className="ss-label" style={{ color: s.color }}>
                {s.label}
              </span>
              <div className="ss-meter">
                <Meter pct={s.pct} color={s.color} variant="session" />
              </div>
              <span className="ss-pct" style={{ color: s.color }}>
                {s.pct}%
              </span>
              <span className="ss-note">{s.note}</span>
            </div>
          ))}
          <div className="session-step compact-step">
            <span className="ss-ctx">~/my-app ⎇ main</span>
            <span className="ss-label" style={{ color: "var(--smart)" }}>
              Smart
            </span>
            <div className="ss-meter">
              <Meter pct={8} color="var(--smart)" variant="session" />
            </div>
            <span className="ss-pct" style={{ color: "var(--smart)" }}>
              8%
            </span>
            <span className="ss-note" style={{ color: "#5dff5750" }}>
              ↑ after /compact, fresh context.
            </span>
          </div>
        </div>
      </section>

      <section className="wrap reveal">
        <span className="section-label pink">the problem</span>
        <h2>Context rot is real.</h2>
        <div className="rot-block">
          <p>
            Early in a chat your agent one-shots the function. A few hundred messages later it
            re-introduces the bug you fixed an hour ago and confidently invents an API. You cannot
            feel it coming. The meter can.
          </p>
          <div className="sig mono">
            {"// the fix is "}
            <b>/compact</b>. you just need to know when.
          </div>
        </div>
      </section>

      <section className="wrap reveal">
        <span className="section-label">the readout</span>
        <h2>Five states. One glance.</h2>
        <p className="lead">
          dumbometer measures the cause: how full the context window is. Empty = sharp. Full = mush.
        </p>
        <div className="states">
          {STATES.map((s) => (
            <div className="state" key={s.nm}>
              <div className="nm" style={{ color: s.color }}>
                {s.nm}
              </div>
              <div className="rg">{s.rg}</div>
              <div className="row">
                <Meter pct={s.pct} color={s.color} variant="mini" />
                <span className="pc" style={{ color: s.color }}>
                  {s.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="cta-band">
          <div className="ct">
            See it in <span className="acc">your</span> status line.
          </div>
          <a className="btn-primary" href="#install">
            Install free →
          </a>
        </div>
      </section>

      <section className="wrap reveal">
        <span className="section-label grape">how it works</span>
        <h2>Simple by design.</h2>
        <p className="lead">Three things, and that is the whole story.</p>

        <div className="how">
          <div className="how-item">
            <h3>{"// reads your % locally"}</h3>
            <p>
              Pulls the actual context-window percentage straight from Claude Code&apos;s status-line
              data, on your machine. No guessing, no transcript scraping, no network call.
            </p>
          </div>
          <div className="how-item">
            <h3>{"// never crashes"}</h3>
            <p>
              Every failure path falls back to safe output and exits clean. It will never garble your
              status line. 64 tests.
            </p>
          </div>
          <div className="how-item">
            <h3>{"// one file"}</h3>
            <p>
              Zero dependencies. MIT. No account, no telemetry, no config needed. Clone it or install
              it, works immediately.
            </p>
          </div>
        </div>

        <div className="zerotok-block">
          <span className="zt-badge">ZERO TOKENS</span>
          <p className="zt-txt">
            Reads a number Claude Code already computed, never calls the model. Runs locally on every
            render. Will never cost you a cent or a single token of context.
          </p>
        </div>
      </section>

      <section className="wrap reveal">
        <span className="section-label grape">faq</span>
        <h2>Questions, answered.</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <div className="q">{f.q}</div>
              <div className="a">{f.a}</div>
            </div>
          ))}
        </div>
        <div className="cta-band">
          <div className="ct">
            That is the whole thing. <span className="acc">Free.</span>
          </div>
          <a className="btn-primary" href="#install">
            Install free →
          </a>
        </div>
      </section>

      <section className="wrap reveal tight" id="install">
        <span className="section-label">install</span>
        <h2>30 seconds. Then forget it exists.</h2>
        <p className="lead">Three commands. Paste them into Claude Code and the meter shows up.</p>
        <div className="install-hi">
          {STEPS.map((cmd, i) => (
            <div className="step" key={cmd}>
              <span className="n">{i + 1}</span>
              <span className="cmd">{cmd}</span>
            </div>
          ))}
          <div className="install-foot">
            <span className="trust-line mono" style={{ marginTop: 0 }}>
              free · MIT · zero tokens · never crashes
            </span>
            <CopyButton text={INSTALL} label="COPY ALL 3" />
          </div>
        </div>
      </section>

      <section className="wrap reveal">
        <span className="section-label pink">pricing</span>
        <h2>Three tiers. Pick the free one.</h2>
        <p className="lead">
          The product is free and that is the honest answer. The other two exist because we could not
          help ourselves.
        </p>
        <div className="tiers">
          <div className="tier free">
            <span className="freechip mono">👈 the one you want</span>
            <div className="tn">Free</div>
            <div className="tagline">The whole product.</div>
            <div className="tp">
              $0<small> /forever</small>
            </div>
            <ul>
              <li>The meter, live in your status line.</li>
              <li>All 5 states, from Smart to Dumb.</li>
              <li>Reads your real context-window %.</li>
              <li>Zero tokens. Runs locally. Never crashes.</li>
              <li>MIT. No account, no telemetry.</li>
            </ul>
            <a className="tcta" href="#install">
              Install free →
            </a>
            <div className="foot">this is everything. you want this one.</div>
          </div>

          <div className="tier tip">
            <div className="tn">
              Big Dumb Energy <span className="oncechip">one-time</span>
            </div>
            <div className="tagline">A tip jar that does stuff.</div>
            <div className="tp">
              $9<small> once</small>
            </div>
            <ul>
              <li>🎨 Extra color themes: vaporwave, matrix, hazard.</li>
              <li>🔥 Roast Mode. &quot;/compact, champ.&quot;</li>
              <li>🥚 Rare galaxy brain 🌌 easter-egg frames.</li>
              <li>🏆 <em>dumb --score</em>. flex your peak dumb score.</li>
              <li>🔤 Custom labels. rename &quot;Dumb&quot; to anything.</li>
            </ul>
            <a className="tcta" href={CHECKOUT}>
              Get it. $9 once →
            </a>
            <div className="foot">a tip jar with perks. you do not need it. but it is nine bucks.</div>
          </div>

          <div className="tier joke">
            <div className="tn">Singularity</div>
            <div className="tagline">Not a real tier. Probably.</div>
            <div className="tp">
              $1M<small> /yr</small>
            </div>
            <ul>
              <li>We fly to your home office.</li>
              <li>We physically tap your shoulder when the context fills.</li>
              <li>Weighted blanket included.</li>
            </ul>
            <a
              className="tcta"
              href="mailto:maximocorrearosas@gmail.com?subject=Singularity%20tier%20(%241M)&body=I%20would%20like%20to%20discuss%20the%20%241M%20Singularity%20tier."
            >
              Contact sales 😉
            </a>
            <div className="foot">we will not be doing this. please buy the free one.</div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="big">
            Stop shipping
            <br />
            <span style={{ color: "var(--dumb)" }}>dumb-session code.</span>
          </div>
          <div className="cta-row" style={{ justifyContent: "center", marginTop: 28 }}>
            <a className="btn-primary" href="#install">
              Install free →
            </a>
            <a className="btn-ghost" href={GH}>
              ★ GitHub →
            </a>
          </div>
          <div className="score">
            reply with your highest <b>dumb score</b> 💀, screenshots encouraged
          </div>
          <div className="links">
            <a href={GH}>github →</a>
            <a href={`${GH}#readme`}>docs →</a>
            <a href={`${GH}/blob/main/LICENSE`}>MIT license</a>
          </div>
          <div className="score" style={{ marginTop: 20, opacity: 0.5 }}>
            made while watching this exact meter climb to 99%
          </div>
        </div>
      </footer>

      <SiteEffects />
    </>
  );
}
