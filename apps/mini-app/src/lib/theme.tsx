"use client";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;

    if (saved === "light" || saved === "dark" || saved === "system") {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      document.documentElement.classList.toggle("dark", mq.matches);

      const handler = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle("dark", e.matches);
      };
      mq.addEventListener("change", handler);

      return () => mq.removeEventListener("change", handler);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", t);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");

  return ctx;
}
