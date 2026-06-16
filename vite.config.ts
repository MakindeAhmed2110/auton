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
      "import.meta.env.VITE_PRIVY_APP_ID": JSON.stringify(
        env.VITE_PRIVY_APP_ID || env.PRIVY_APP_ID || "",
      ),
    },
  };
});
