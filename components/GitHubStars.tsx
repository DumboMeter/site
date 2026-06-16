"use client";

import { useEffect, useState } from "react";

// Live social proof: fetches the repo star count. Falls back to a plain
// "Star on GitHub" CTA if the API is unavailable (rate limit, offline).
export default function GitHubStars({ repo }: { repo: string }) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`https://api.github.com/repos/${repo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && typeof d.stargazers_count === "number") setStars(d.stargazers_count);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [repo]);

  return (
    <a
      className="chip star"
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {stars === null ? (
        <>★ Star on GitHub</>
      ) : (
        <>
          ★ <b>{stars.toLocaleString()}</b> on GitHub
        </>
      )}
    </a>
  );
}
