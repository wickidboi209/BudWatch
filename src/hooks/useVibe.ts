import { createContext, useContext } from "react";

export type VibeContextValue = {
  selectedVibeId: string | null;
  setSelectedVibeId: (vibeId: string) => void;
};

export const VibeContext = createContext<VibeContextValue | undefined>(undefined);

export function useVibe() {
  const context = useContext(VibeContext);

  if (!context) {
    throw new Error("useVibe must be used inside VibeProvider.");
  }

  return context;
}
