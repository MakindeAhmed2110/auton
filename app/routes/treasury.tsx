import type { Route } from "./+types/treasury";
import { TreasuryPage } from "../components/treasury-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Treasury — Auton" },
    {
      name: "description",
      content:
        "Live treasury stats for $AUTO — buybacks, burns, staker rewards, and supply metrics.",
    },
  ];
}

export default function Treasury() {
  return <TreasuryPage />;
}
