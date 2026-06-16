import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import BN from "bn.js";
import { useSolanaWallet } from "../hooks/use-solana-wallet";
import { useStaking } from "../hooks/use-staking";
import { formatTokenAmount } from "../lib/staking/format";
import { LoginModal } from "./login-modal";

const ANTI_SNIPE_SECONDS = 86_400;

function truncateAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function formatDisplayAmount(
  amount: BN,
  decimals: number,
  loading: boolean,
): string {
  if (loading) return "...";
  if (amount.isZero()) return "0";
  return formatTokenAmount(amount, decimals, 2);
}

function TokenInput({
  id,
  value,
  onChange,
  onMax,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onMax: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-black px-4 py-3">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder="0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="pixel-sans w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span className="pixel-sans shrink-0 text-sm text-white/50">AUTO</span>
      <button
        type="button"
        onClick={onMax}
        disabled={disabled}
        className="pixel-sans shrink-0 rounded-lg border border-white/15 px-2.5 py-1 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Max
      </button>
    </div>
  );
}

function ActionButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="pixel-serif w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-base text-white transition-colors hover:border-white/30 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        checked
          ? "border-emerald-500/50 bg-emerald-500/30"
          : "border-white/20 bg-white/10"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function StakingPage() {
  const { ready, authenticated, address } = useSolanaWallet();
  const { status, entries, loading, error, config } = useStaking(address);
  const [loginOpen, setLoginOpen] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [autoCompound, setAutoCompound] = useState(false);

  const isLive = status === "live";
  const canInteract = isLive && authenticated && address;
  const now = Math.floor(Date.now() / 1000);

  const activeEntries = entries.filter(
    (entry) => entry.account.closedTs.isZero(),
  );

  const { staked, earning, coolingDown } = activeEntries.reduce(
    (acc, entry) => {
      const amount = entry.account.amount;
      const created = entry.account.createdTs.toNumber();
      const inCooldown = !entry.account.unstakeTs.isZero();
      const pastAntiSnipe = now >= created + ANTI_SNIPE_SECONDS;

      acc.staked = acc.staked.add(amount);

      if (inCooldown) {
        acc.coolingDown = acc.coolingDown.add(amount);
      } else if (pastAntiSnipe) {
        acc.earning = acc.earning.add(amount);
      } else {
        acc.coolingDown = acc.coolingDown.add(amount);
      }

      return acc;
    },
    { staked: new BN(0), earning: new BN(0), coolingDown: new BN(0) },
  );

  const claimableUsdc = new BN(0);
  const vaultAddress = config.stakePool || null;

  const stakedDisplay = formatDisplayAmount(
    staked,
    config.tokenDecimals,
    loading && isLive,
  );
  const earningDisplay = formatDisplayAmount(
    earning,
    config.tokenDecimals,
    loading && isLive,
  );
  const coolingDisplay = formatDisplayAmount(
    coolingDown,
    config.tokenDecimals,
    loading && isLive,
  );

  const actionDisabledReason = !isLive
    ? "Staking opens at launch"
    : !authenticated
      ? "Connect wallet"
      : null;

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10 px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-lg items-center justify-between">
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

      <main className="mx-auto max-w-lg px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8">
          <h1 className="pixel-serif text-2xl text-white md:text-3xl">
            Stake <span className="dollar">$</span>AUTO · self-custody
          </h1>
          <p className="pixel-sans mt-4 text-sm leading-relaxed text-white/60">
            Your <span className="dollar">$</span>AUTO stays in your own on-chain
            vault. Only you can unstake or claim. No server holds your funds.
          </p>
          {address ? (
            <p className="pixel-sans mt-3 text-xs text-white/40">
              wallet: {truncateAddress(address)}
            </p>
          ) : ready ? (
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="pixel-sans mt-3 text-xs text-[#80a0c1] transition-colors hover:text-[#80a0c1]/80"
            >
              Connect wallet →
            </button>
          ) : null}
        </div>

        <div className="mb-4 rounded-2xl border border-white/15 p-5 md:p-6">
          <div className="grid grid-cols-3 gap-4 border-b border-white/10 pb-5">
            <div className="text-center">
              <div className="pixel-serif text-2xl text-white md:text-3xl">
                {stakedDisplay}
              </div>
              <div className="pixel-sans mt-1 text-xs text-white/40">
                AUTO staked
              </div>
            </div>
            <div className="text-center">
              <div className="pixel-serif text-2xl text-emerald-400 md:text-3xl">
                {earningDisplay}
              </div>
              <div className="pixel-sans mt-1 text-xs text-white/40">
                earning
              </div>
            </div>
            <div className="text-center">
              <div className="pixel-serif text-2xl text-white md:text-3xl">
                {coolingDisplay}
              </div>
              <div className="pixel-sans mt-1 text-xs text-white/40">
                cooling down
              </div>
            </div>
          </div>

          <div className="py-6 text-center">
            <div className="pixel-serif text-3xl text-emerald-400 md:text-4xl">
              ${claimableUsdc.isZero() ? "0" : formatTokenAmount(claimableUsdc, config.rewardDecimals, 2)}
            </div>
            <div className="pixel-sans mt-1 text-xs text-white/40">
              claimable USDC
            </div>
          </div>

          <p className="pixel-sans border-t border-white/10 pt-4 text-center text-xs leading-relaxed text-white/40">
            Stake earns rewards after 24h (anti-snipe). Unstaking pulls your
            newest deposits first, so aged stake keeps earning.
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="pixel-sans text-xs text-white/40">
              Your on-chain vault
            </span>
            <span className="pixel-sans text-xs text-white/60">
              {vaultAddress ? truncateAddress(vaultAddress) : "—"}
            </span>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-white/15 p-4 md:p-5">
          <p className="pixel-sans text-center text-sm leading-relaxed text-white/60">
            Staking 1,000,000 AUTO for 24h boosts your worker payout to 80%
            (from 70%).
          </p>
        </div>

        {error && (
          <p className="pixel-sans mb-4 text-sm text-red-400/80">{error}</p>
        )}

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/15 p-5 md:p-6">
            <h2 className="pixel-serif mb-4 text-lg text-white">Stake</h2>
            <div className="space-y-4">
              <TokenInput
                id="stake-amount"
                value={stakeAmount}
                onChange={setStakeAmount}
                onMax={() =>
                  setStakeAmount(
                    formatTokenAmount(staked, config.tokenDecimals, 6),
                  )
                }
                disabled={!canInteract}
              />
              <ActionButton disabled={!canInteract || !stakeAmount}>
                {actionDisabledReason ?? "Stake"}
              </ActionButton>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 p-5 md:p-6">
            <h2 className="pixel-serif mb-4 text-lg text-white">Unstake</h2>
            <div className="space-y-4">
              <TokenInput
                id="unstake-amount"
                value={unstakeAmount}
                onChange={setUnstakeAmount}
                onMax={() =>
                  setUnstakeAmount(
                    formatTokenAmount(staked, config.tokenDecimals, 6),
                  )
                }
                disabled={!canInteract}
              />
              <ActionButton disabled={!canInteract || !unstakeAmount}>
                {actionDisabledReason ?? "Unstake"}
              </ActionButton>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 p-5 md:p-6">
            <h2 className="pixel-serif mb-2 text-lg text-white">
              Claim rewards
            </h2>
            <p className="pixel-sans mb-4 text-xs leading-relaxed text-white/50">
              Claims your full claimable USDC to your wallet.
            </p>
            <ActionButton disabled={!canInteract || claimableUsdc.isZero()}>
              {actionDisabledReason ??
                `Claim $${claimableUsdc.isZero() ? "0" : formatTokenAmount(claimableUsdc, config.rewardDecimals, 2)} USDC`}
            </ActionButton>
          </div>

          <div className="rounded-2xl border border-white/15 p-5 md:p-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="pixel-serif text-lg text-white">Auto-compound</h2>
              <Toggle
                checked={autoCompound}
                onChange={setAutoCompound}
                disabled={!canInteract}
              />
            </div>
            <p className="pixel-sans text-xs leading-relaxed text-white/50">
              When on, your daily USDC rewards are used to buy{" "}
              <span className="dollar">$</span>AUTO and staked straight into your
              vault — only you can ever withdraw it. Compounded stake starts
              earning after the normal 24h.
            </p>
          </div>
        </div>

        {!isLive && (
          <p className="pixel-sans mt-8 text-center text-xs text-white/30">
            Powered by{" "}
            <a
              href="https://streamflow.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#80a0c1] transition-colors hover:text-[#80a0c1]/80"
            >
              Streamflow
            </a>
            . Set <code className="text-white/40">VITE_AUTO_TOKEN_MINT</code> and{" "}
            <code className="text-white/40">VITE_AUTO_STAKE_POOL</code> when
            ready.
          </p>
        )}
      </main>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
