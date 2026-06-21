"use client";

import * as React from "react";
import { en } from "@/locales/en";
import { fa } from "@/locales/fa";

type Theme = "light" | "dark" | "system";
type Locale = "en" | "fa";

interface AppContextType {
  theme: Theme;
  locale: Locale;
  dir: "ltr" | "rtl";
  t: typeof en;
  setTheme: (theme: Theme) => void;
  toggleLocale: () => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = React.useState<Theme>("dark");
  const [locale, setLocale] = React.useState<Locale>("en");

  const t = locale === "en" ? en : fa;
  const dir = locale === "fa" ? "rtl" : "ltr";

  React.useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (current: Theme) => {
      root.classList.remove("light", "dark");
      if (current === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.add(systemManager(systemTheme));
      } else {
        root.classList.add(current);
      }
    };

    const systemManager = (val: string) => val;
    applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleLocale = () => {
    setLocale((prev) => (prev === "en" ? "fa" : "en"));
  };

  return (
    <AppContext.Provider
      value={{ theme, locale, dir, t, setTheme, toggleLocale }}
    >
      <div dir={dir} className={locale === "fa" ? "font-fa" : "font-sans"}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
