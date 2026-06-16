import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  COMPUTE_CONTRACTS,
  formatRatePerM,
  formatTokenMillions,
  hedgeSavingsPercent,
  type ContractType,
} from "../config/marketplace";
import { useBackendSession } from "../hooks/use-backend-session";
import { useDashboard } from "../hooks/use-dashboard";
import { LoginModal } from "./login-modal";

const TYPE_FILTERS: { id: "all" | ContractType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "future", label: "Futures" },
  { id: "capacity", label: "Capacity" },
];

function ContractCard({
  contract,
  userBalance,
}: {
  contract: (typeof COMPUTE_CONTRACTS)[number];
  userBalance?: string;
}) {
  const savings = hedgeSavingsPercent(contract);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/[0.02] p-5 transition-colors hover:border-white/25 hover:bg-white/[0.04] md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="pixel-sans text-xs tracking-widest text-[#80a0c1]/80 uppercase">
            {contract.tier}
          </div>
          <h2 className="pixel-serif mt-1 text-xl text-white md:text-2xl">
            {contract.name}
          </h2>
          <p className="pixel-sans mt-2 text-sm text-white/60">
            {contract.subtitle}
          </p>
        </div>
        <span
          className={`pixel-sans shrink-0 rounded-lg border px-2.5 py-1 text-xs ${
            contract.type === "future"
              ? "border-emerald-500/30 text-emerald-400"
              : "border-[#80a0c1]/30 text-[#80a0c1]"
          }`}
        >
          {contract.type === "future" ? "Future" : "Capacity"}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-black/40 p-3">
          <div className="pixel-sans text-xs text-white/40">Locked rate</div>
          <div className="pixel-serif mt-1 text-lg text-emerald-400">
            {formatRatePerM(contract.lockedRatePerM)}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-3">
          <div className="pixel-sans text-xs text-white/40">Spot</div>
          <div className="pixel-serif mt-1 text-lg text-white/70 line-through decoration-white/30">
            {formatRatePerM(contract.spotRatePerM)}
          </div>
        </div>
      </div>

      <div className="pixel-sans mb-4 flex flex-wrap gap-2 text-xs text-white/50">
        <span className="rounded-md border border-white/10 px-2 py-1">
          Save {savings}%
        </span>
        <span className="rounded-md border border-white/10 px-2 py-1">
          Exp {contract.expiry}
        </span>
        <span className="rounded-md border border-white/10 px-2 py-1">
          Min {formatTokenMillions(contract.minPurchaseTokens)} tokens
        </span>
      </div>

      <ul className="pixel-sans mb-4 space-y-1.5 text-xs text-white/60">
        {contract.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="text-emerald-400/80">▸</span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="pixel-sans mb-4 text-xs text-white/40">
        <span className="text-white/50">Models: </span>
        {contract.models.join(", ")}
      </div>

      {userBalance !== undefined && (
        <div className="pixel-sans mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-400/90">
          Your balance: {formatTokenMillions(Number(userBalance))} tokens
          {Number(userBalance) <= 0 ? " — purchase to activate" : ""}
        </div>
      )}

      <div className="mt-auto flex gap-2">
        <Link
          to="/dashboard"
          className="pixel-serif flex-1 rounded-xl border border-white/15 bg-white/[0.06] py-3 text-center text-sm text-white transition-colors hover:border-white/30"
        >
          Manage
        </Link>
        <button
          type="button"
          className="pixel-serif flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm text-emerald-400 transition-colors hover:border-emerald-500/50"
        >
          Purchase
        </button>
      </div>
    </article>
  );
}

export function MarketplacePage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<"all" | ContractType>("all");
  const [loginOpen, setLoginOpen] = useState(false);

  const { authenticated, hasSession } = useBackendSession();
  const { data } = useDashboard(authenticated && hasSession);

  const balanceByTier = useMemo(() => {
    const map = new Map<string, string>();
    for (const balance of data?.computeBalances ?? []) {
      map.set(balance.modelTier, balance.tokenBalanceRemaining);
    }
    return map;
  }, [data]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return COMPUTE_CONTRACTS.filter((contract) => {
      const matchesType =
        typeFilter === "all" || contract.type === typeFilter;
      const matchesQuery =
        !normalized ||
        contract.name.toLowerCase().includes(normalized) ||
        contract.tier.toLowerCase().includes(normalized) ||
        contract.models.some((model) =>
          model.toLowerCase().includes(normalized),
        );

      return matchesType && matchesQuery;
    });
  }, [query, typeFilter]);

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10 px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            to="/"
            className="pixel-serif-logo text-lg font-bold text-white md:text-xl"
          >
            AUTON
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="pixel-sans text-sm text-white/60 transition-colors hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/"
              className="pixel-sans text-sm text-white/60 transition-colors hover:text-white"
            >
              ← Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 md:mb-10">
          <h1 className="pixel-serif text-3xl text-white md:text-4xl">
            Compute Marketplace
          </h1>
          <p className="pixel-sans mt-4 max-w-3xl text-sm leading-relaxed text-white/60 md:text-base">
            Lock in fixed inference rates with forward contracts. Hedge spot
            volatility, guarantee GPU capacity, and route agents through the
            Auton gateway — no intermediaries.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search models, tiers, or capacity..."
            className="pixel-sans w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none md:max-w-md"
          />
          <div className="flex gap-2">
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setTypeFilter(filter.id)}
                className={`pixel-sans rounded-lg border px-3 py-2 text-xs transition-colors ${
                  typeFilter === filter.id
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-white/50 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {!authenticated && (
          <div className="pixel-sans mb-8 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/60">
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="text-[#80a0c1] transition-colors hover:text-[#80a0c1]/80"
            >
              Connect wallet
            </button>{" "}
            to see your contract balances on each listing.
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((contract) => (
            <ContractCard
              key={contract.tier}
              contract={contract}
              userBalance={
                authenticated && hasSession
                  ? balanceByTier.get(contract.tier) ?? "0"
                  : undefined
              }
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="pixel-sans mt-12 text-center text-sm text-white/40">
            No contracts match your search.
          </p>
        )}

        <section className="mt-16 border-t border-white/10 pt-12">
          <h2 className="pixel-serif mb-6 text-2xl text-white">
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Purchase a forward tier",
                body: "Buy tokenized compute capacity at today's locked rate before spot moves.",
              },
              {
                step: "02",
                title: "Get an API key",
                body: "Generate a gateway key in your dashboard for autonomous agents.",
              },
              {
                step: "03",
                title: "Route inference",
                body: "Point any OpenAI-compatible client at Auton — balances deduct per token.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="pixel-serif text-2xl text-white/40">
                  {item.step}
                </div>
                <h3 className="pixel-serif mt-2 text-lg text-white">
                  {item.title}
                </h3>
                <p className="pixel-sans mt-2 text-sm text-white/60">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
