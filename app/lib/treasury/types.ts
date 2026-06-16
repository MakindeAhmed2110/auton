export type TreasuryTimePoint = {
  date: string;
  label: string;
  value: number;
};

export type TreasuryStats = {
  totalBurned: number;
  burnedSupplyPercent: number;
  buybackCount: number;
  returnedToHolders: number;
  totalStaked: number;
  stakedSupplyPercent: number;
  buybackSpendUsdc: number;
  stakerRewardsUsdc: number;
  settlementFeesUsdc: number;
};

export type TreasuryData = {
  stats: TreasuryStats;
  burnHistory: TreasuryTimePoint[];
  stakedHistory: TreasuryTimePoint[];
};
