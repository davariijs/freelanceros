import { NativeModules, Platform } from "react-native";
import { en } from "@/locales/en";
import { fa } from "@/locales/fa";

type AppLocale = "en" | "fa";

const getSystemLocale = (): AppLocale => {
  try {
    const localeStr =
      Platform.OS === "ios"
        ? NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0]
        : NativeModules.I18nManager?.localeIdentifier;

    const normalizedLocale = String(localeStr || "").toLowerCase();

    return normalizedLocale.startsWith("fa") || normalizedLocale.includes("ir")
      ? "fa"
      : "en";
  } catch (error) {
    return "en";
  }
};

export function useMobileTranslation() {
  const locale: AppLocale = getSystemLocale();

  const t = locale === "fa" ? fa : en;

  return { t, locale };
}
