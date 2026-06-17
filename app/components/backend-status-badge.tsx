import { useAutonConfig } from "../hooks/use-auton-config";
import { useBackendHealth } from "../hooks/use-backend-health";

export function BackendStatusBadge() {
  const { online, apiUrl } = useBackendHealth();
  const { config } = useAutonConfig();

  if (online === null) {
    return (
      <span className="pixel-sans text-xs text-white/35">Checking API...</span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span
        className={`pixel-sans inline-flex items-center gap-1.5 text-xs ${
          online ? "text-emerald-400" : "text-amber-400"
        }`}
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            online ? "bg-emerald-400" : "bg-amber-400"
          }`}
        />
        {online ? "API online" : "API offline"}
      </span>
      <span className="pixel-sans text-xs text-white/30">{apiUrl}</span>
      {config?.autoTokenMint && (
        <span className="pixel-sans text-xs text-white/30">
          $AUTO: {config.autoTokenMint.slice(0, 4)}…
          {config.autoTokenMint.slice(-4)}
        </span>
      )}
    </div>
  );
}
