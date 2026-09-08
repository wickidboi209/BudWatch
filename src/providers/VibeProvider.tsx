import { useMemo, useState, type PropsWithChildren } from "react";
import { VibeContext } from "../hooks/useVibe";

export function VibeProvider({ children }: PropsWithChildren) {
  const [selectedVibeId, setSelectedVibeId] = useState<string | null>(null);

  const value = useMemo(() => ({ selectedVibeId, setSelectedVibeId }), [selectedVibeId]);

  return <VibeContext.Provider value={value}>{children}</VibeContext.Provider>;
}
