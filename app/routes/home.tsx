import type { Route } from "./+types/home";
import { Landing } from "../components/landing";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Auton — Derivatives for Decentralized Compute" },
    {
      name: "description",
      content:
        "The derivatives layer for decentralized compute — hedge volatility, guarantee capacity, earn yield.",
    },
  ];
}

export default function Home() {
  return <Landing />;
}
