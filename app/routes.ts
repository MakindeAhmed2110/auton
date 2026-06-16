import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("staking", "routes/staking.tsx"),
  route("treasury", "routes/treasury.tsx"),
] satisfies RouteConfig;
