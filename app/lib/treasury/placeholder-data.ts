import type { TreasuryData } from "./types";

export const EMPTY_TREASURY_DATA: TreasuryData = {
  stats: {
    totalBurned: 0,
    burnedSupplyPercent: 0,
    buybackCount: 0,
    returnedToHolders: 0,
    totalStaked: 0,
    stakedSupplyPercent: 0,
    buybackSpendUsdc: 0,
    stakerRewardsUsdc: 0,
    settlementFeesUsdc: 0,
  },
  burnHistory: [],
  stakedHistory: [],
};
