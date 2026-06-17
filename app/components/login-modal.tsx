import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  useConnectWallet,
  useLoginWithOAuth,
  useLoginWithSiws,
  usePrivy,
  type WalletListEntry,
} from "@privy-io/react-auth";
import { isPrivyConfigured } from "../lib/privy-config";

declare global {
  interface Window {
    phantom?: { solana?: { isPhantom?: boolean } };
    solflare?: { isSolflare?: boolean };
    backpack?: { isBackpack?: boolean };
  }
}

function privyErrorCode(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  return "unknown_auth_error";
}

function formatPrivyAuthError(err: unknown, origin: string) {
  const code = privyErrorCode(err);

  if (
    code === "exited_auth_flow" ||
    code === "exited_update_flow"
  ) {
    return [
      "Sign-in was cancelled or interrupted.",
      "",
      "Try again and complete every step — including any wallet setup Privy shows after X.",
      "Do not close the browser tab while redirecting to X.",
      "",
      "Or use Connect wallet instead.",
    ].join("\n");
  }

  if (
    code === "oauth_user_denied"
  ) {
    return "Login cancelled on X.";
  }

  if (
    code === "oauth_unexpected"
  ) {
    return [
      "X login failed after redirect.",
      "",
      "If you use custom X OAuth credentials in Privy, set the callback URL in the X developer portal to:",
      "https://auth.privy.io/api/v1/oauth/callback",
      "",
      `Also confirm allowed domains include: ${origin}`,
    ].join("\n");
  }

  if (
    code.toLowerCase().includes("not allowed") ||
    code.toLowerCase().includes("invalid_origin") ||
    code === "disallowed_login_method"
  ) {
    return [
      code,
      "",
      "Fix in Privy dashboard (dashboard.privy.io):",
      "1. Login methods → Socials → enable X (Twitter)",
      `2. Configuration → Domains → add: ${origin}`,
      "3. Also add: https://www.autonaisol.xyz and https://autonaisol.xyz",
      "4. Advanced → Allowed OAuth redirect URLs — leave empty OR add exact origins above (no trailing slash)",
      "",
      "Or use Connect wallet instead.",
    ].join("\n");
  }

  return code;
}

const WALLET_INSTALL_URLS: Partial<Record<WalletListEntry, string>> = {
  phantom: "https://phantom.app/download",
  solflare: "https://solflare.com/download",
  backpack: "https://backpack.app/download",
};

function isWalletExtensionInstalled(wallet: WalletListEntry): boolean {
  if (typeof window === "undefined") return false;

  switch (wallet) {
    case "phantom":
      return Boolean(window.phantom?.solana?.isPhantom);
    case "solflare":
      return Boolean(window.solflare?.isSolflare);
    case "backpack":
      return Boolean(window.backpack?.isBackpack);
    default:
      return true;
  }
}

function walletInstallMessage(wallet: WalletListEntry): string {
  const url = WALLET_INSTALL_URLS[wallet];
  const label =
    wallet === "phantom"
      ? "Phantom"
      : wallet === "solflare"
        ? "Solflare"
        : "Backpack";

  return [
    `${label} extension not detected in this browser.`,
    "",
    url ? `Install it from ${url}, refresh the page, then try again.` : "",
    "Or choose a different wallet.",
  ]
    .filter(Boolean)
    .join("\n");
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

type SolanaConnectedWallet = {
  type: "solana";
  address: string;
  walletClientType: string;
  connectorType: string;
  provider: {
    signMessage: (input: {
      message: Uint8Array;
    }) => Promise<{ signature: Uint8Array | number[] }>;
  };
};

function isSolanaConnectedWallet(
  wallet: unknown,
): wallet is SolanaConnectedWallet {
  if (typeof wallet !== "object" || wallet === null || !("type" in wallet)) {
    return false;
  }

  if ((wallet as { type: unknown }).type !== "solana") return false;

  const provider = (wallet as { provider?: unknown }).provider;
  return (
    typeof provider === "object" &&
    provider !== null &&
    "signMessage" in provider &&
    typeof (provider as { signMessage: unknown }).signMessage === "function"
  );
}

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

function LoginModalShell({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        {children}
      </div>
    </div>,
    document.body,
  );
}

function LoginModalContent({ open, onClose }: LoginModalProps) {
  const [view, setView] = useState<ModalView>("main");
  const [error, setError] = useState<string | null>(null);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const { ready, authenticated } = usePrivy();
  const { generateSiwsMessage, loginWithSiws } = useLoginWithSiws();
  const { initOAuth, loading: twitterLoading } = useLoginWithOAuth({
    onComplete: () => {
      setError(null);
      onClose();
    },
    onError: (err) => {
      setError(formatPrivyAuthError(err, window.location.origin));
    },
  });
  const { connectWallet } = useConnectWallet({
    onSuccess: async ({ wallet }) => {
      if (!isSolanaConnectedWallet(wallet)) {
        setConnectingWallet(null);
        setError("Connected wallet is not a Solana wallet.");
        return;
      }

      try {
        const message = await generateSiwsMessage({ address: wallet.address });
        const encodedMessage = new TextEncoder().encode(message);
        const { signature } = await wallet.provider.signMessage({
          message: encodedMessage,
        });
        const signatureBytes =
          signature instanceof Uint8Array
            ? signature
            : new Uint8Array(signature as ArrayLike<number>);

        await loginWithSiws({
          message,
          signature: bytesToBase64(signatureBytes),
          walletClientType: wallet.walletClientType,
          connectorType: wallet.connectorType,
        });

        setConnectingWallet(null);
        setError(null);
        onClose();
      } catch (err) {
        setConnectingWallet(null);
        setError(formatPrivyAuthError(err, window.location.origin));
      }
    },
    onError: (err) => {
      setConnectingWallet(null);
      setError(formatPrivyAuthError(err, window.location.origin));
    },
  });

  useEffect(() => {
    if (!open) {
      setView("main");
      setError(null);
      setConnectingWallet(null);
    }
  }, [open]);

  useEffect(() => {
    if (authenticated && open) {
      onClose();
    }
  }, [authenticated, open, onClose]);

  const handleTwitterLogin = async () => {
    if (!ready) {
      setError("Auth is still loading. Wait a moment and try again.");
      return;
    }

    if (twitterLoading) return;

    setError(null);

    try {
      await initOAuth({ provider: "twitter" });
    } catch (err) {
      setError(formatPrivyAuthError(err, window.location.origin));
    }
  };

  const handleWalletLogin = (wallet: WalletListEntry) => {
    if (!ready) {
      setError("Auth is still loading. Wait a moment and try again.");
      return;
    }

    if (!isWalletExtensionInstalled(wallet)) {
      setError(walletInstallMessage(wallet));
      return;
    }

    setError(null);
    setConnectingWallet(wallet);

    try {
      connectWallet({
        walletChainType: "solana-only",
        walletList: [wallet, "wallet_connect_qr_solana"],
        preSelectedWalletId: wallet,
        description: "Connect your Solana wallet to sign in to Auton",
      });
    } catch (err) {
      setConnectingWallet(null);
      setError(
        err instanceof Error
          ? err.message
          : "Could not open wallet. Install the extension and allow popups.",
      );
    }
  };

  return (
    <LoginModalShell open={open} onClose={onClose}>
      <div className="mb-6 flex items-start justify-between gap-4">
        {view === "wallets" ? (
          <button
            type="button"
            className="text-white/70 transition-colors hover:text-white"
            aria-label="Back"
            onClick={() => {
              setView("main");
              setError(null);
            }}
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

      {!ready ? (
        <div className="py-8 text-center">
          <p className="pixel-sans text-sm text-white/60">Loading auth...</p>
        </div>
      ) : view === "main" ? (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="pixel-serif text-2xl text-white md:text-3xl">
              Sign in to Auton
            </h2>
            <p className="pixel-sans mt-3 text-sm leading-relaxed text-white/70">
              Sign in with X or connect a Solana wallet to access compute
              derivatives markets.
            </p>
          </div>

          {error && (
            <p className="pixel-sans whitespace-pre-line rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="space-y-3">
            <button
              type="button"
              disabled={twitterLoading}
              onClick={() => void handleTwitterLogin()}
              className="flex w-full items-center justify-center gap-3 border border-white/20 px-4 py-3 text-white transition-colors hover:border-white/40 disabled:opacity-50"
            >
              <XProviderIcon />
              <span className="pixel-sans text-sm">
                {twitterLoading ? "Redirecting to X..." : "Twitter / X"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setView("wallets");
                setError(null);
              }}
              className="flex w-full items-center justify-center gap-3 border border-white/20 px-4 py-3 text-white transition-colors hover:border-white/40"
            >
              <UserIcon />
              <span className="pixel-sans text-sm">Connect wallet</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="pixel-serif text-2xl text-white md:text-3xl">
              Connect wallet
            </h2>
            <p className="pixel-sans mt-2 text-sm text-white/60">
              Install a Solana wallet extension, unlock it, then approve the
              connection popup.
            </p>
          </div>

          {error && (
            <p className="pixel-sans whitespace-pre-line rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="space-y-3">
            {WALLETS.map((wallet) => (
              <button
                key={wallet.id}
                type="button"
                disabled={connectingWallet !== null}
                onClick={() => handleWalletLogin(wallet.id)}
                className="flex w-full items-center gap-3 border border-white/20 px-4 py-3 text-white transition-colors hover:border-white/40 disabled:opacity-50"
              >
                <WalletGlyph wallet={wallet.id} />
                <span className="pixel-sans text-sm">
                  {connectingWallet === wallet.id
                    ? "Connecting..."
                    : wallet.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pixel-sans mt-8 flex items-center justify-center gap-2 text-xs text-white/40">
        <span>Protected by</span>
        <PrivyMark />
      </div>
    </LoginModalShell>
  );
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  if (!isPrivyConfigured) {
    return (
      <LoginModalShell open={open} onClose={onClose}>
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            className="text-white/70 hover:text-white"
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="space-y-4 text-center">
          <h2 className="pixel-serif text-xl text-white">Auth not configured</h2>
          <p className="pixel-sans text-sm text-white/60">
            Set <code className="text-[#80a0c1]">VITE_PRIVY_APP_ID</code> in
            your environment (Vercel → Settings → Environment Variables), then
            redeploy.
          </p>
        </div>
      </LoginModalShell>
    );
  }

  return <LoginModalContent open={open} onClose={onClose} />;
}
