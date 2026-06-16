import { usePrivy } from "@privy-io/react-auth";

export function useSolanaWallet() {
  const { ready, authenticated, user } = usePrivy();

  const solanaWallet = user?.linkedAccounts?.find(
    (account) =>
      account.type === "wallet" &&
      "chainType" in account &&
      account.chainType === "solana",
  );

  const address =
    solanaWallet && "address" in solanaWallet ? solanaWallet.address : null;

  return {
    ready,
    authenticated,
    address,
  };
}
