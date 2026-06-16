import { type ReactNode } from "react";
import { Link } from "react-router";
import { useTreasury } from "../hooks/use-treasury";
import {
  formatCompactNumber,
  formatPercent,
  formatTokenCount,
  formatUsd,
} from "../lib/treasury/format";
import { TreasuryAreaChart } from "./treasury-area-chart";

function StatCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-white/[0.02] p-5 md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function TreasuryPage() {
  const { status, data, loading, error } = useTreasury();
  const { stats, burnHistory, stakedHistory } = data;
  const isLive = status === "live";

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10 px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            to="/"
            className="pixel-serif-logo text-lg font-bold text-white md:text-xl"
          >
            AUTON
          </Link>
          <Link
            to="/"
            className="pixel-sans text-sm text-white/60 transition-colors hover:text-white"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 md:mb-10">
          <h1 className="pixel-serif text-3xl text-white md:text-4xl">
            Treasury
          </h1>
          <p className="pixel-sans mt-4 max-w-3xl text-sm leading-relaxed text-white/60 md:text-base">
            100% of the compute margin and a share of{" "}
            <span className="dollar">$</span>AUTO trading fees flow into this
            treasury. Half buys back and burns <span className="dollar">$</span>
            AUTO; half is paid to stakers in USDC. Everything below updates live.
          </p>
        </div>

        {error && (
          <p className="pixel-sans mb-6 text-sm text-red-400/80">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          <StatCard className="border-emerald-500/20 bg-emerald-500/[0.03]">
            <div className="pixel-serif text-3xl text-emerald-400 md:text-4xl">
              {loading && isLive
                ? "..."
                : formatTokenCount(stats.totalBurned)}
            </div>
            <div className="pixel-sans mt-2 text-sm text-white/70">
              <span className="dollar">$</span>AUTO burned forever
            </div>
            <div className="pixel-sans mt-1 text-xs text-emerald-400/70">
              {loading && isLive
                ? "..."
                : `${formatPercent(stats.burnedSupplyPercent)} of supply removed`}
            </div>
          </StatCard>

          <StatCard>
            <div className="pixel-serif text-3xl text-white md:text-4xl">
              {loading && isLive
                ? "..."
                : formatUsd(stats.returnedToHolders)}
            </div>
            <div className="pixel-sans mt-2 text-sm text-white/70">
              returned to holders + stakers
            </div>
            <div className="pixel-sans mt-1 text-xs text-white/40">
              buybacks + USDC rewards
            </div>
          </StatCard>

          <StatCard>
            <div className="pixel-serif text-3xl text-white md:text-4xl">
              {loading && isLive
                ? "..."
                : formatCompactNumber(stats.totalStaked)}
            </div>
            <div className="pixel-sans mt-2 text-sm text-white/70">
              <span className="dollar">$</span>AUTO staked
            </div>
            <div className="pixel-sans mt-1 text-xs text-white/40">
              {loading && isLive
                ? "..."
                : `${formatPercent(stats.stakedSupplyPercent, 1)} of supply`}
            </div>
          </StatCard>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <StatCard>
            <div className="mb-4">
              <div className="pixel-sans text-xs text-white/40">
                Cumulative <span className="dollar">$</span>AUTO burned
              </div>
              <div className="pixel-serif mt-1 text-2xl text-white">
                {loading && isLive
                  ? "..."
                  : `${formatCompactNumber(stats.totalBurned)} AUTO`}
              </div>
              <div className="pixel-sans mt-1 text-xs text-white/40">
                {loading && isLive
                  ? "..."
                  : `across ${stats.buybackCount} buybacks`}
              </div>
            </div>
            <TreasuryAreaChart
              data={burnHistory}
              color="#34d399"
              gradientId="treasury-burn-gradient"
              stepped
            />
          </StatCard>

          <StatCard>
            <div className="mb-4">
              <div className="pixel-sans text-xs text-white/40">
                <span className="dollar">$</span>AUTO staked over time
              </div>
              <div className="pixel-serif mt-1 text-2xl text-white">
                {loading && isLive
                  ? "..."
                  : `${formatCompactNumber(stats.totalStaked)} AUTO`}
              </div>
              <div className="pixel-sans mt-1 text-xs text-white/40">
                rises on stakes, dips on unstakes
              </div>
            </div>
            <TreasuryAreaChart
              data={stakedHistory}
              color="#80a0c1"
              gradientId="treasury-staked-gradient"
            />
          </StatCard>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          <StatCard>
            <div className="pixel-serif text-2xl text-white md:text-3xl">
              {loading && isLive
                ? "..."
                : formatUsd(stats.buybackSpendUsdc)}
            </div>
            <div className="pixel-sans mt-2 text-sm text-white/50">
              spent on buybacks
            </div>
          </StatCard>

          <StatCard>
            <div className="pixel-serif text-2xl text-white md:text-3xl">
              {loading && isLive
                ? "..."
                : formatUsd(stats.stakerRewardsUsdc)}
            </div>
            <div className="pixel-sans mt-2 text-sm text-white/50">
              paid to stakers
            </div>
          </StatCard>

          <StatCard>
            <div className="pixel-serif text-2xl text-white md:text-3xl">
              {loading && isLive
                ? "..."
                : formatUsd(stats.settlementFeesUsdc)}
            </div>
            <div className="pixel-sans mt-2 text-sm text-white/50">
              settlement fees collected
            </div>
          </StatCard>
        </div>

        {!isLive && (
          <p className="pixel-sans mt-8 text-center text-xs text-white/30">
            Treasury stats go live when <span className="dollar">$</span>AUTO
            launches. Set{" "}
            <code className="text-white/40">VITE_AUTO_TOKEN_MINT</code> to
            enable on-chain reads.
          </p>
        )}
      </main>
    </div>
  );
}
