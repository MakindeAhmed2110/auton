import { useState } from "react";

export const AUTO_TOKEN_ADDRESS =
  "7io8XEMRMoQoCvD3phKR2QR5EeoMmJnYM1dsjVdYpump";

function truncate(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-6)}`;
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12.5L9 17.5L20 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TokenAddress({
  variant = "dark",
  className = "",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(AUTO_TOKEN_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const isLight = variant === "light";
  const shell = isLight
    ? "border-black/15 bg-black/[0.03] text-black hover:border-black/30"
    : "border-white/15 bg-white/[0.03] text-white hover:border-white/30";
  const label = isLight ? "text-black/45" : "text-white/45";
  const value = isLight ? "text-black/80" : "text-white/80";

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`group inline-flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors ${shell} ${className}`}
      aria-label="Copy $AUTO token address"
    >
      <span
        className={`pixel-sans text-[10px] font-medium tracking-widest uppercase ${label}`}
      >
        <span className="dollar">$</span>AUTO CA
      </span>
      <span className={`hidden font-mono text-xs sm:inline ${value}`}>
        {AUTO_TOKEN_ADDRESS}
      </span>
      <span className={`font-mono text-xs sm:hidden ${value}`}>
        {truncate(AUTO_TOKEN_ADDRESS)}
      </span>
      <span className={copied ? "text-[#80a0c1]" : isLight ? "text-black/50" : "text-white/50"}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
    </button>
  );
}
