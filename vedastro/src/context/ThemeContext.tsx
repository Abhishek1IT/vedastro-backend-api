/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark"); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("app-theme") as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const hasDarkClass = document.documentElement.classList.contains("dark");
        setTheme(hasDarkClass ? "dark" : "light");
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be executed within an active ThemeProvider boundary.");
  }
  return context;
}