import { useCallback, useState } from "react";
import bs58 from "bs58";
import { useSignAndSendTransaction, useWallets } from "@privy-io/react-auth/solana";
import { useAutonConfig } from "./use-auton-config";
import { useSolanaWallet } from "./use-solana-wallet";
import {
  fetchMarketplaceQuote,
  purchaseComputeContract,
} from "../lib/api/marketplace";
import {
  buildUsdcTransferTransaction,
  serializeTransaction,
} from "../lib/solana/usdc-transfer";

export function useMarketplacePurchase() {
  const { config } = useAutonConfig();
  const { address } = useSolanaWallet();
  const { wallets } = useWallets();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const [paying, setPaying] = useState(false);

  const purchase = useCallback(
    async (modelTier: string, tokenAmount: number) => {
      const paymentRequired = config?.marketplacePaymentRequired ?? true;

      if (!paymentRequired) {
        return purchaseComputeContract({ modelTier, tokenAmount });
      }

      if (!address) {
        throw new Error("Connect a Solana wallet to pay with USDC.");
      }

      const wallet =
        wallets.find((entry) => entry.address === address) ?? wallets[0];

      if (!wallet) {
        throw new Error("No Solana wallet available for payment.");
      }

      const treasuryWallet = config?.masterVaultWallet?.trim();
      const usdcMint = config?.usdcTokenMint?.trim();

      if (!treasuryWallet || !usdcMint) {
        throw new Error(
          "Marketplace payment is not configured. Try again later.",
        );
      }

      setPaying(true);

      try {
        const quote = await fetchMarketplaceQuote(modelTier, tokenAmount);
        const amountMicro = BigInt(quote.usdcAmountMicro);

        const transaction = await buildUsdcTransferTransaction({
          payer: address,
          treasuryWallet,
          usdcMint,
          amountMicro,
        });

        const { signature } = await signAndSendTransaction({
          transaction: serializeTransaction(transaction),
          wallet,
          chain: "solana:mainnet",
        });

        const txSignature = bs58.encode(signature);

        return purchaseComputeContract({
          modelTier,
          tokenAmount,
          txSignature,
        });
      } finally {
        setPaying(false);
      }
    },
    [address, config, signAndSendTransaction, wallets],
  );

  return { purchase, paying };
}
