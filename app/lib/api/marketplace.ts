import { request } from "./autonClient";

export type PurchasedBalance = {
  id: string;
  modelTier: string;
  tokenBalanceRemaining: string;
  expiryDate: string;
  isExpired: boolean;
};

export async function purchaseComputeContract(
  modelTier: string,
  tokenAmount: number,
) {
  return request<{
    balance: PurchasedBalance;
    message: string;
  }>("/api/v1/marketplace/purchase", {
    method: "POST",
    body: JSON.stringify({ modelTier, tokenAmount }),
  });
}
