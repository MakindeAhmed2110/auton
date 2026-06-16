import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [tailwindcss(), reactRouter()],
    resolve: {
      tsconfigPaths: true,
    },
    define: {
      "import.meta.env.VITE_SITE_URL": JSON.stringify(env.VITE_SITE_URL || ""),
      "import.meta.env.VITE_PRIVY_APP_ID": JSON.stringify(
        env.VITE_PRIVY_APP_ID || env.PRIVY_APP_ID || "",
      ),
      "import.meta.env.VITE_AUTON_API_URL": JSON.stringify(
        env.VITE_AUTON_API_URL || "https://api.autonaisol.xyz",
      ),
      "import.meta.env.VITE_SOLANA_RPC_URL": JSON.stringify(
        env.VITE_SOLANA_RPC_URL || "",
      ),
    },
    build: {
      rolldownOptions: {
        onwarn(warning, warn) {
          if (warning.code === "INVALID_ANNOTATION") return;
          warn(warning);
        },
      },
    },
  };
});
