import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import type { ReactNode } from "react";
import { isPrivyConfigured, PRIVY_APP_ID } from "./lib/privy-config";

const solanaConnectors = toSolanaWalletConnectors({
  // Avoid Phantom popups on every page load; connect only when the user clicks.
  shouldAutoConnect: false,
});

export function PrivyProviders({ children }: { children: ReactNode }) {
  if (!isPrivyConfigured) {
    if (import.meta.env.DEV) {
      console.warn(
        "[Auton] VITE_PRIVY_APP_ID is missing — wallet and Twitter login disabled.",
      );
    }
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          walletChainType: "solana-only",
          walletList: [
            "phantom",
            "solflare",
            "backpack",
            "detected_solana_wallets",
            "wallet_connect_qr_solana",
          ],
        },
        loginMethods: ["twitter", "wallet"],
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
