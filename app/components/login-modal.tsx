import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  useConnectWallet,
  useLoginWithOAuth,
  usePrivy,
  type WalletListEntry,
} from "@privy-io/react-auth";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

type ModalView = "main" | "wallets";

const WALLETS: { id: WalletListEntry; label: string }[] = [
  { id: "phantom", label: "Phantom" },
  { id: "solflare", label: "Solflare" },
  { id: "backpack", label: "Backpack" },
];

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M10 3L5 8L10 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function XProviderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 20c1.5-4 12.5-4 14 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function PrivyMark() {
  return (
    <span className="inline-flex items-center gap-1.5 text-white/40">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <circle cx="12" cy="12" r="10" />
      </svg>
      <span className="pixel-sans text-xs">privy</span>
    </span>
  );
}

function WalletGlyph({ wallet }: { wallet: WalletListEntry }) {
  const colors: Partial<Record<WalletListEntry, string>> = {
    phantom: "bg-[#ab9ff2]",
    solflare: "bg-[#ffef46] text-black",
    backpack: "bg-[#e33e3f]",
  };

  return (
    <span
      className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold ${colors[wallet] ?? "bg-white/20"}`}
    >
      {wallet === "phantom" ? "P" : wallet === "solflare" ? "S" : "B"}
    </span>
  );
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [view, setView] = useState<ModalView>("main");
  const [mounted, setMounted] = useState(false);
  const { authenticated } = usePrivy();
  const { initOAuth, loading: oauthLoading } = useLoginWithOAuth();
  const { connectWallet } = useConnectWallet({
    onSuccess: () => onClose(),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setView("main");
    }
  }, [open]);

  useEffect(() => {
    if (authenticated && open) {
      onClose();
    }
  }, [authenticated, open, onClose]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const handleTwitterLogin = async () => {
    try {
      await initOAuth({ provider: "twitter" });
    } catch {
      // OAuth redirect or user cancellation
    }
  };

  const handleWalletLogin = (wallet: WalletListEntry) => {
    connectWallet({
      walletChainType: "solana-only",
      walletList: [wallet],
      preSelectedWalletId: wallet,
      description: "",
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to Auton"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close login modal"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md border border-white/15 bg-black p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          {view === "wallets" ? (
            <button
              type="button"
              className="text-white/70 transition-colors hover:text-white"
              aria-label="Back"
              onClick={() => setView("main")}
            >
              <BackIcon />
            </button>
          ) : (
            <span className="w-4" />
          )}

          <button
            type="button"
            className="ml-auto text-white/70 transition-colors hover:text-white"
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        {view === "main" ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="pixel-serif text-2xl text-white md:text-3xl">
                Sign in to Auton
              </h2>
              <p className="pixel-sans mt-3 text-sm leading-relaxed text-white/70">
                Sign in with X to access compute derivatives markets — no card,
                no crypto needed.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                disabled={oauthLoading}
                onClick={handleTwitterLogin}
                className="flex w-full items-center justify-center gap-3 border border-white/20 px-4 py-3 text-white transition-colors hover:border-white/40 disabled:opacity-50"
              >
                <XProviderIcon />
                <span className="pixel-sans text-sm">Twitter</span>
              </button>

              <button
                type="button"
                onClick={() => setView("wallets")}
                className="flex w-full items-center justify-center gap-3 border border-white/20 px-4 py-3 text-white transition-colors hover:border-white/40"
              >
                <UserIcon />
                <span className="pixel-sans text-sm">More options</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="pixel-serif text-2xl text-white md:text-3xl">
                Sign in to Auton
              </h2>
            </div>

            <div className="space-y-3">
              {WALLETS.map((wallet) => (
                <button
                  key={wallet.id}
                  type="button"
                  onClick={() => handleWalletLogin(wallet.id)}
                  className="flex w-full items-center gap-3 border border-white/20 px-4 py-3 text-white transition-colors hover:border-white/40"
                >
                  <WalletGlyph wallet={wallet.id} />
                  <span className="pixel-sans text-sm">{wallet.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pixel-sans mt-8 flex items-center justify-center gap-2 text-xs text-white/40">
          <span>Protected by</span>
          <PrivyMark />
        </div>
      </div>
    </div>,
    document.body,
  );
}
