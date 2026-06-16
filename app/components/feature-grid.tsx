import type { ReactNode } from "react";
import {
  EarnYieldIllustration,
  GuaranteeCapacityIllustration,
  HedgeVolatilityIllustration,
  OnChainMarketsIllustration,
} from "./feature-illustrations";

const FEATURES = [
  {
    title: "Hedge Volatility",
    description:
      "Lock in compute prices with futures and options. Protect workloads from spot market swings and budget with certainty.",
    large: true,
    colSpan: "col-span-3",
    illustration: <HedgeVolatilityIllustration />,
  },
  {
    title: "Guarantee Capacity",
    description:
      "Reserve GPU hours on decentralized networks. Capacity commitments ensure your jobs run when you need them.",
    large: false,
    colSpan: "col-span-2",
    illustration: <GuaranteeCapacityIllustration />,
  },
  {
    title: "On-Chain Markets",
    description: "No intermediaries. Trade compute derivatives directly from your wallet.",
    large: false,
    colSpan: "col-span-2",
    illustration: <OnChainMarketsIllustration />,
  },
  {
    title: "Earn Yield",
    description:
      "Provide liquidity to compute derivatives markets. Earn fees and staking rewards in stablecoins.",
    large: true,
    colSpan: "col-span-3",
    illustration: <EarnYieldIllustration />,
  },
] as const;

function FeatureCard({
  title,
  description,
  large,
  illustration,
  className = "",
}: {
  title: string;
  description: string;
  large: boolean;
  illustration: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:bg-white/[0.04] ${large ? "p-8" : "p-6"} ${className}`}
    >
      <h3 className={`pixel-serif text-white ${large ? "text-2xl md:text-3xl" : "text-xl"}`}>
        {title}
      </h3>
      <p className={`pixel-sans text-sm text-white/70 ${large ? "mt-3" : "mt-2"}`}>
        {description}
      </p>
      <div className="mt-4 flex flex-1 items-center justify-center">{illustration}</div>
    </div>
  );
}

export function FeatureGrid() {
  return (
    <section id="markets" className="bg-black py-12 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-4 md:hidden">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <h3 className="pixel-serif text-xl text-white">{feature.title}</h3>
              <p className="pixel-sans mt-2 text-sm text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="hidden h-[750px] grid-cols-5 grid-rows-2 gap-4 md:grid">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} className={feature.colSpan} />
          ))}
        </div>
      </div>
    </section>
  );
}
