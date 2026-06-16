import type { Route } from "./+types/staking";
import { StakingPage } from "../components/staking-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Stake $AUTO — Auton" },
    {
      name: "description",
      content:
        "Stake $AUTO in your own on-chain vault. Earn USDC rewards. Self-custody staking powered by Streamflow.",
    },
  ];
}

export default function Staking() {
  return <StakingPage />;
}
