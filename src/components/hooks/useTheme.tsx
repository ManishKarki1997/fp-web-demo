import { ThemeProviderContext, ThemeProviderState } from "@/context/ThemeContext";

import { useContext } from "react";

export function useTheme(): ThemeProviderState {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
}
