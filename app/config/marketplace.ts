export type ContractType = "future" | "capacity";

export type ComputeContract = {
  tier: string;
  name: string;
  subtitle: string;
  type: ContractType;
  models: string[];
  expiry: string;
  lockedRatePerM: number;
  spotRatePerM: number;
  minPurchaseTokens: number;
  capacityLabel: string;
  features: string[];
};

export const COMPUTE_CONTRACTS: ComputeContract[] = [
  {
    tier: "DEEPSEEK_JULY26",
    name: "DeepSeek Forward",
    subtitle: "Lock inference rates through July 2026",
    type: "future",
    models: [
      "deepseek/deepseek-chat",
      "deepseek/deepseek-coder",
      "deepseek/deepseek-r1",
    ],
    expiry: "2026-07-31",
    lockedRatePerM: 0.14,
    spotRatePerM: 0.22,
    minPurchaseTokens: 1_000_000,
    capacityLabel: "H100-equivalent batch",
    features: ["Hedge volatility", "Gateway-ready", "On-chain settlement"],
  },
  {
    tier: "LLAMA_AUG26",
    name: "Llama Forward",
    subtitle: "Fixed-rate Llama 3.x capacity through August 2026",
    type: "future",
    models: [
      "meta-llama/llama-3.3-70b-instruct",
      "meta-llama/llama-3.1-70b-instruct",
      "meta-llama/llama-3.1-8b-instruct",
    ],
    expiry: "2026-08-31",
    lockedRatePerM: 0.18,
    spotRatePerM: 0.29,
    minPurchaseTokens: 500_000,
    capacityLabel: "A100-equivalent batch",
    features: ["Guarantee capacity", "Multi-model tier", "Earn yield eligible"],
  },
  {
    tier: "GPU_Q3_CAPACITY",
    name: "Q3 GPU Commitment",
    subtitle: "Reserved decentralized GPU hours — Q3 2026",
    type: "capacity",
    models: ["auton/gpu-worker"],
    expiry: "2026-09-30",
    lockedRatePerM: 0.95,
    spotRatePerM: 1.4,
    minPurchaseTokens: 100_000,
    capacityLabel: "Dedicated GPU hours",
    features: ["SLA-backed", "Verifier staking", "Priority scheduling"],
  },
];

export function hedgeSavingsPercent(contract: ComputeContract) {
  const savings =
    ((contract.spotRatePerM - contract.lockedRatePerM) /
      contract.spotRatePerM) *
    100;
  return Math.round(savings);
}

export function formatRatePerM(rate: number) {
  return `$${rate.toFixed(2)}/M`;
}

export function formatTokenMillions(tokens: number) {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(tokens % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(0)}K`;
  }
  return String(tokens);
}
