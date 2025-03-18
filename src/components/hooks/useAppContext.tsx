import { AppProviderContent, AppProviderState } from "@/context/AppContext";

import { useContext } from "react";

export function useAppContext(): AppProviderState {
  const context = useContext(AppProviderContent);

  if (context === undefined)
    throw new Error("useAppContext must be used within a AppProvider context");

  return context;
}
