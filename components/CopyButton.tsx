"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label = "COPY ALL",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="copybtn"
      aria-label="Copy install commands"
      onClick={() => {
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          })
          .catch(() => {});
      }}
    >
      {copied ? "COPIED ✓" : label}
    </button>
  );
}
