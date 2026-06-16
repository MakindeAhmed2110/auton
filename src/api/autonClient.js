/**
 * Auton API client for the React Router frontend.
 *
 * Set VITE_AUTON_API_URL in your frontend .env (default: http://localhost:4000)
 */

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_AUTON_API_URL) ||
  "http://localhost:4000";

const TOKEN_KEY = "auton_jwt";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
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
      data?.error?.message || data?.message || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch a server-generated nonce + sign-in message for wallet authentication.
 */
export async function fetchLoginNonce(walletAddress) {
  return request(`/api/v1/auth/nonce/${encodeURIComponent(walletAddress)}`);
}

/**
 * Verify a Solana wallet signature and receive a JWT session token.
 */
export async function loginWithWallet(walletAddress, message, signature) {
  const result = await request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ walletAddress, message, signature }),
  });

  if (result.token) {
    setToken(result.token);
  }

  return result;
}

/**
 * Clear the stored JWT session.
 */
export function logout() {
  clearToken();
}

/**
 * Returns active API keys, forward contract compute balances, and claimable USDC yield.
 */
export async function fetchDashboardStats() {
  return request("/api/v1/dashboard/");
}

/**
 * Create a new Auton API key for the OpenAI-compatible gateway.
 */
export async function createApiKey(name) {
  return request("/api/v1/dashboard/api-keys", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

/**
 * Submit an on-chain $AUTO stake deposit after the user signs a transfer tx.
 */
export async function submitStakingTx(txSignature, amount) {
  return request("/api/v1/stake/deposit", {
    method: "POST",
    body: JSON.stringify({ txSignature, amount }),
  });
}

/**
 * Claim accumulated USDC yield from staking (queued for treasury payout).
 */
export async function claimStakingYield() {
  return request("/api/v1/stake/claim", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

/**
 * Fetch staking summary totals.
 */
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
