/**
 * Auton API client for the React Router frontend.
 *
 * Set VITE_AUTON_API_URL in your frontend .env (default: http://localhost:4000)
 */

const API_BASE =
  import.meta.env.VITE_AUTON_API_URL || "http://localhost:4000";

const TOKEN_KEY = "auton_jwt";

export type DashboardStats = {
  apiKeys: {
    id: string;
    name: string;
    key_prefix: string;
    active: boolean;
    created_at: string;
  }[];
  computeBalances: {
    id: string;
    modelTier: string;
    tokenBalanceRemaining: string;
    expiryDate: string;
    isExpired: boolean;
  }[];
  staking: {
    totalStakedAuto: string;
    claimableUsdcYield: string;
    stakeCount: number;
  };
};

type RequestError = Error & { status?: number; data?: unknown };

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  const token = getToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data as { error?: { message?: string }; message?: string })?.error
        ?.message ||
      (data as { message?: string })?.message ||
      `Request failed (${response.status})`;
    const error = new Error(message) as RequestError;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

export async function fetchLoginNonce(walletAddress: string) {
  return request<{ nonce: string; message: string }>(
    `/api/v1/auth/nonce/${encodeURIComponent(walletAddress)}`,
  );
}

export async function loginWithWallet(
  walletAddress: string,
  message: string,
  signature: string,
) {
  const result = await request<{ token: string }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ walletAddress, message, signature }),
  });

  if (result.token) {
    setToken(result.token);
  }

  return result;
}

export async function fetchDashboardStats() {
  return request<DashboardStats>("/api/v1/dashboard/");
}

export async function createApiKey(name: string) {
  return request<{
    apiKey: DashboardStats["apiKeys"][number];
    key: string;
    warning: string;
  }>("/api/v1/dashboard/api-keys", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function submitStakingTx(
  txSignature: string,
  amount: number | string,
) {
  return request("/api/v1/stake/deposit", {
    method: "POST",
    body: JSON.stringify({ txSignature, amount }),
  });
}

export async function claimStakingYield() {
  return request("/api/v1/stake/claim", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function fetchStakingSummary() {
  return request("/api/v1/stake/summary");
}

export const autonClient = {
  fetchLoginNonce,
  loginWithWallet,
  logout,
  fetchDashboardStats,
  createApiKey,
  submitStakingTx,
  claimStakingYield,
  fetchStakingSummary,
  getToken,
};

export default autonClient;
