import { useCallback, useEffect, useState } from "react";
import {
  createApiKey,
  fetchDashboardStats,
  getToken,
} from "../../src/api/autonClient.js";

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

export function useDashboard(enabled: boolean) {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled || !getToken()) return;

    setLoading(true);
    setError(null);

    try {
      const stats = await fetchDashboardStats();
      setData(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const generateKey = useCallback(async (name: string) => {
    const result = await createApiKey(name);
    setNewKey(result.key);
    await refresh();
    return result;
  }, [refresh]);

  return {
    data,
    loading,
    error,
    newKey,
    setNewKey,
    refresh,
    generateKey,
  };
}
