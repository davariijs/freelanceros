import * as React from "react";
import { View } from "react-native";
import { en } from "@/locales/en";
import { fa } from "@/locales/fa";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsModal } from "@/components/organisms/SettingsModal";

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
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const settingsModalTrigger = {
  open: () => {},
  close: () => {},
};

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
  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserProfile | null>(null);

  const t = locale === "en" ? en : fa;
  const dir = locale === "fa" ? "rtl" : "ltr";

  React.useEffect(() => {
    async function loadSavedSettings() {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        const savedLocale = await AsyncStorage.getItem("locale");
        const savedUser = await AsyncStorage.getItem("user");

        if (savedTheme) setThemeState(savedTheme as Theme);
        if (savedLocale) setLocale(savedLocale as Locale);
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
    loadSavedSettings();
  }, []);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const toggleLocale = async () => {
    const nextLocale = locale === "en" ? "fa" : "en";
    setLocale(nextLocale);
    try {
      await AsyncStorage.setItem("locale", nextLocale);
    } catch (error) {
      console.error("Failed to save locale:", error);
    }
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
        isSettingsOpen,
        setIsSettingsOpen,
        user,
        setUser,
      }}
    >
      <View style={{ flex: 1 }}>{children}</View>
      <SettingsModal />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
