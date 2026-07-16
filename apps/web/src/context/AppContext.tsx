"use client";

import * as React from "react";
import { en } from "@/locales/en";
import { fa } from "@/locales/fa";

type Theme = "light" | "dark" | "system";
type Locale = "en" | "fa";

export interface ToastState {
  message: string;
  type: "success" | "error";
}
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
}

interface AppContextType {
  theme: Theme;
  locale: Locale;
  dir: "ltr" | "rtl";
  t: typeof en;
  setTheme: (theme: Theme) => void;
  toggleLocale: () => void;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  isCommandOpen: boolean;
  setIsCommandOpen: (open: boolean) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: "success" | "error") => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
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
  const [activeTaskId, setActiveTaskId] = React.useState<string | null>(null);
  const [isCommandOpen, setIsCommandOpen] = React.useState<boolean>(false);
  const [toast, setToast] = React.useState<ToastState | null>(null);
  const [user, setUser] = React.useState<UserProfile | null>(null);

  const t = locale === "en" ? en : fa;
  const dir = locale === "fa" ? "rtl" : "ltr";

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTheme = localStorage.getItem("theme") as Theme;
        const savedLocale = localStorage.getItem("locale") as Locale;
        const savedUser = localStorage.getItem("user");
        if (savedTheme) setThemeState(savedTheme);
        if (savedLocale) setLocale(savedLocale);
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("light");
      root.classList.remove("dark");
      root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("theme", newTheme);
      } catch (e) {}
      const isSecure = window.location.protocol === "https:";
      document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax${isSecure ? "; Secure" : ""}`;
    }
  };

  const toggleLocale = () => {
    setLocale((prev) => {
      const next = prev === "en" ? "fa" : "en";
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("locale", next);
        } catch (e) {}
        const isSecure = window.location.protocol === "https:";
        document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax${isSecure ? "; Secure" : ""}`;
      }
      return next;
    });
  };

  const showToast = React.useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ message, type });
    },
    [],
  );

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <AppContext.Provider
      value={{
        theme,
        locale,
        dir,
        t,
        setTheme,
        toggleLocale,
        activeTaskId,
        setActiveTaskId,
        isCommandOpen,
        setIsCommandOpen,
        toast,
        showToast,
        user,
        setUser,
      }}
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
