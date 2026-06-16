import { useState, type FormEvent } from "react";
import { AutoTokenSection } from "./auto-token-section";
import { FeatureGrid } from "./feature-grid";
import { Footer } from "./footer";
import { Header } from "./header";
import { PixelBackground } from "./pixel-background";
function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12L21 3L14 21L11 13L3 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Landing() {
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="relative bg-black">
      <Header />

      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <PixelBackground />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 md:px-6">
          <div className="-mt-24 w-full max-w-5xl space-y-6 text-center md:space-y-8">
            <div className="space-y-4">
              <div className="pixel-serif-wrapper">
                <h1 className="pixel-serif text-4xl leading-none font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                  AUTON
                </h1>
              </div>
              <p className="pixel-sans mx-auto max-w-2xl px-4 text-sm text-white/90 md:text-lg lg:text-xl">
                The derivatives layer for decentralized compute — hedge volatility,
                guarantee capacity, earn yield.
              </p>
            </div>

            <form
              className="mx-auto mt-6 w-full max-w-3xl px-2 md:mt-8"
              onSubmit={handleSubmit}
            >
              <div className="flex items-stretch gap-2 md:gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Explore markets..."
                  className="pixel-sans flex-1 rounded-xl border border-[#2a2a2a] bg-black px-3 py-3 text-sm text-white transition-colors placeholder:text-white/50 focus:border-[#3a3a3a] focus:outline-none md:px-4 md:text-lg"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-xl border border-[#2a2a2a] bg-black px-3 py-3 text-white transition-colors hover:border-[#3a3a3a] md:px-4"
                  aria-label="Search"
                >
                  <SendIcon />
                </button>
              </div>
            </form>

            <p className="pixel-sans mx-auto mt-6 max-w-xl px-4 text-xs text-white/70 md:text-sm">
              A permissionless protocol where providers, consumers, and liquidity
              participants trade compute derivatives on-chain.
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <a
            href="#markets"
            className="group flex cursor-pointer flex-col items-center gap-2"
          >
            <span className="pixel-sans text-xs tracking-widest text-white/70 uppercase transition-colors group-hover:text-white">
              Scroll
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-white/70 transition-colors group-hover:text-white"
            >
              <path
                d="M8 2v12M3 9l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </a>
        </div>
      </section>

      <FeatureGrid />

      <AutoTokenSection />

      <Footer />
    </div>
  );
}
