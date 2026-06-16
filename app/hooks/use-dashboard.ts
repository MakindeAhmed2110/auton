import { useCallback, useEffect, useState } from "react";
import type { DashboardStats } from "../lib/api/autonClient";
import {
  createApiKey,
  fetchDashboardStats,
  getToken,
} from "../lib/api/autonClient";

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
