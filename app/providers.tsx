import { useEffect, useState, type ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  const [PrivyProviders, setPrivyProviders] = useState<
    null | ((props: { children: ReactNode }) => ReactNode)
  >(null);

  useEffect(() => {
    import("./privy-providers.client").then((mod) => {
      setPrivyProviders(() => mod.PrivyProviders);
    });
  }, []);

  if (!PrivyProviders) {
    return <>{children}</>;
  }

  return <PrivyProviders>{children}</PrivyProviders>;
}
