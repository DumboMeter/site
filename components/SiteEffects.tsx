"use client";

import { useEffect } from "react";

// Body-level effects: one orchestrated entrance (data-mounted after a double rAF,
// so the browser paints once first) + scroll reveal via IntersectionObserver.
export default function SiteEffects() {
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() =>
        document.body.setAttribute("data-mounted", "")
      );
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      io.disconnect();
    };
  }, []);

  return null;
}
