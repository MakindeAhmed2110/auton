import { useCallback, useEffect, useState } from "react";
import { autoTreasuryConfig, getTreasuryStatus } from "../config/auto-treasury";
import { isStakingPoolConfigured } from "../config/auto-staking";
import { fetchStakePool } from "../lib/staking/client";
import { EMPTY_TREASURY_DATA } from "../lib/treasury/placeholder-data";
import type { TreasuryData } from "../lib/treasury/types";

export function useTreasury() {
  const status = getTreasuryStatus();
  const [data, setData] = useState<TreasuryData>(EMPTY_TREASURY_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status !== "live") {
      setData(EMPTY_TREASURY_DATA);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let totalStaked = 0;

      if (isStakingPoolConfigured()) {
        const pool = await fetchStakePool();
        if (pool) {
          totalStaked = Number(pool.totalEffectiveStake.toString());
        }
      }

      const stakedSupplyPercent =
        autoTreasuryConfig.totalSupply > 0
          ? (totalStaked / autoTreasuryConfig.totalSupply) * 100
          : 0;

      if (autoTreasuryConfig.treasuryApiUrl) {
        const response = await fetch(autoTreasuryConfig.treasuryApiUrl);
        if (!response.ok) {
          throw new Error("Failed to load treasury stats");
        }

        const payload = (await response.json()) as TreasuryData;
        setData({
          ...payload,
          stats: {
            ...payload.stats,
            totalStaked,
            stakedSupplyPercent,
          },
        });
        return;
      }

      setData({
        ...EMPTY_TREASURY_DATA,
        stats: {
          ...EMPTY_TREASURY_DATA.stats,
          totalStaked,
          stakedSupplyPercent,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load treasury data",
      );
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { status, data, loading, error, refresh };
}
