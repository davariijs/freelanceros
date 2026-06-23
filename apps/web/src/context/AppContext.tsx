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

interface AppProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
  initialTheme: Theme;
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  initialLocale,
  initialTheme,
}) => {
  const [theme, setThemeState] = React.useState<Theme>(initialTheme);
  const [locale, setLocale] = React.useState<Locale>(initialLocale);

  const t = locale === "en" ? en : fa;
  const dir = locale === "fa" ? "rtl" : "ltr";

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      const savedLocale = localStorage.getItem("locale") as Locale;
      if (savedTheme) setThemeState(savedTheme);
      if (savedLocale) setLocale(savedLocale);
    }
  }, []);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax; Secure`;
    }
  };

  const toggleLocale = () => {
    setLocale((prev) => {
      const next = prev === "en" ? "fa" : "en";
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", next);
        document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax; Secure`;
      }
      return next;
    });
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
