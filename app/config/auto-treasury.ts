/**
 * $AUTO treasury config — set when the token launches:
 *
 *   VITE_AUTO_TOKEN_MINT=<SPL mint address>
 *   VITE_AUTO_TOTAL_SUPPLY=1000000000
 *   VITE_AUTO_TREASURY_API_URL=<optional backend stats endpoint>
 */

export const autoTreasuryConfig = {
  tokenMint: import.meta.env.VITE_AUTO_TOKEN_MINT?.trim() ?? "",
  totalSupply: Number(import.meta.env.VITE_AUTO_TOTAL_SUPPLY ?? 1_000_000_000),
  treasuryApiUrl: import.meta.env.VITE_AUTO_TREASURY_API_URL?.trim() ?? "",
} as const;

export function isTreasuryConfigured() {
  return autoTreasuryConfig.tokenMint.length > 0;
}

export function getTreasuryStatus(): "pending" | "live" {
  return isTreasuryConfigured() ? "live" : "pending";
}
