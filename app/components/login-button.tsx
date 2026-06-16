import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { LoginModal } from "./login-modal";

function truncateAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function LoginButton() {
  const [open, setOpen] = useState(false);
  const { ready, authenticated, user, logout } = usePrivy();

  const solanaWallet = user?.linkedAccounts?.find(
    (account) =>
      account.type === "wallet" &&
      "chainType" in account &&
      account.chainType === "solana",
  );

  const walletAddress =
    solanaWallet && "address" in solanaWallet ? solanaWallet.address : null;

  if (!ready) {
    return (
      <span className="pixel-serif-logo rounded-lg border border-white/20 px-3 py-2 text-sm text-white/50 md:px-4">
        ...
      </span>
    );
  }

  if (authenticated) {
    return (
      <button
        type="button"
        onClick={() => logout()}
        className="pixel-serif-logo rounded-lg border border-white/20 px-3 py-2 text-sm text-white transition-colors hover:border-white/40 md:px-4"
        title="Log out"
      >
        {walletAddress ? truncateAddress(walletAddress) : "Account"}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pixel-serif-logo rounded-lg border border-white/20 px-3 py-2 text-sm text-white transition-colors hover:border-white/40 md:px-4"
      >
        Login
      </button>
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
