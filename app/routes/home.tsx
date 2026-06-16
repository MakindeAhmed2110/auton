import type { Route } from "./+types/home";
import { Landing } from "../components/landing";
import { siteMeta } from "../lib/site-meta";

export function meta({}: Route.MetaArgs) {
  return siteMeta({
    title: "Auton — Derivatives for Decentralized Compute",
    description:
      "The derivatives layer for decentralized compute — hedge volatility, guarantee capacity, earn yield.",
    path: "/",
  });
}

export default function Home() {
  return <Landing />;
}
