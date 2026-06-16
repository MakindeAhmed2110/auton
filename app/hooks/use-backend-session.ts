import { useCallback, useState } from "react";
import { useSignMessage } from "@privy-io/react-auth";
import { useSolanaWallet } from "./use-solana-wallet";
import {
  fetchLoginNonce,
  getToken,
  isBackendConfigured,
  loginWithWallet,
  logout as clearBackendToken,
} from "../lib/api/autonClient";

function encodeSignature(signature: Uint8Array | string): string {
  if (typeof signature === "string") return signature;

  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const bytes = signature;
  const digits = [0];

  for (const byte of bytes) {
    let carry = byte;
    for (let i = 0; i < digits.length; i++) {
      carry += digits[i] << 8;
      digits[i] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }

  let result = "";
  for (const byte of bytes) {
    if (byte === 0) result += alphabet[0];
    else break;
  }
  for (let i = digits.length - 1; i >= 0; i--) {
    result += alphabet[digits[i]];
  }
  return result;
}

export function useBackendSession() {
  const { ready, authenticated, address } = useSolanaWallet();
  const { signMessage } = useSignMessage();
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const hasSession = Boolean(getToken());

  const syncSession = useCallback(async () => {
    if (!isBackendConfigured()) {
      setSyncError("Auton API is not live yet — check back soon.");
      return false;
    }

    if (!address) {
      setSyncError("Connect a Solana wallet first");
      return false;
    }

    setSyncing(true);
    setSyncError(null);

    try {
      const { message } = await fetchLoginNonce(address);
      const result = await signMessage(
        { message },
        { address, uiOptions: { showWalletUIs: true } },
      );

      const signature = encodeSignature(
        result.signature as Uint8Array | string,
      );

      await loginWithWallet(address, message, signature);
      return true;
    } catch (error) {
      setSyncError(
        error instanceof Error ? error.message : "Failed to sign in",
      );
      return false;
    } finally {
      setSyncing(false);
    }
  }, [address, signMessage]);

  const logout = useCallback(() => {
    clearBackendToken();
  }, []);

  return {
    ready,
    authenticated,
    address,
    backendConfigured: isBackendConfigured(),
    hasSession,
    syncing,
    syncError,
    syncSession,
    logout,
  };
}
