import { useCallback, useEffect, useState } from "react";
import type { StakePool } from "@streamflow/staking";
import {
  autoStakingConfig,
  getStakingStatus,
} from "../config/auto-staking";
import {
  fetchStakePool,
  fetchUserStakeEntries,
} from "../lib/staking/client";

type StakingStatus = ReturnType<typeof getStakingStatus>;
type StakeEntryAccount = Awaited<
  ReturnType<typeof fetchUserStakeEntries>
>[number];

export function useStaking(walletAddress: string | null) {
  const status: StakingStatus = getStakingStatus();
  const [pool, setPool] = useState<StakePool | null>(null);
  const [entries, setEntries] = useState<StakeEntryAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status !== "live") {
      setPool(null);
      setEntries([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [poolData, userEntries] = await Promise.all([
        fetchStakePool(),
        walletAddress
          ? fetchUserStakeEntries(walletAddress)
          : Promise.resolve([]),
      ]);

      setPool(poolData);
      setEntries(userEntries);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load staking data",
      );
    } finally {
      setLoading(false);
    }
  }, [status, walletAddress]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    status,
    pool,
    entries,
    loading,
    error,
    refresh,
    config: autoStakingConfig,
  };
}
