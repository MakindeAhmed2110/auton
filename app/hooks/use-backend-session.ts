import { useCallback, useEffect, useState } from "react";
import { useSignMessage } from "@privy-io/react-auth";
import { useSolanaWallet } from "./use-solana-wallet";
import {
  activateFallbackSession,
  fetchLoginNonce,
  hasActiveSession,
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
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    setHasSession(hasActiveSession());
  }, [authenticated, address]);

  const syncSession = useCallback(async () => {
    if (!address) {
      return false;
    }

    setSyncing(true);

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
      setHasSession(true);
      return true;
    } catch {
      activateFallbackSession();
      setHasSession(true);
      return true;
    } finally {
      setSyncing(false);
    }
  }, [address, signMessage]);

  const logout = useCallback(() => {
    clearBackendToken();
    setHasSession(false);
  }, []);

  return {
    ready,
    authenticated,
    address,
    hasSession,
    syncing,
    syncSession,
    logout,
  };
}
