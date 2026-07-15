import * as React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useApp, settingsModalTrigger } from "@/context/AppContext";
import { Globe, Sun, Moon, Settings } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export function SettingsModal() {
  const { theme, setTheme, toggleLocale, locale, t } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const systemTheme = useColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  React.useEffect(() => {
    settingsModalTrigger.open = () => setIsSettingsOpen(true);
    settingsModalTrigger.close = () => setIsSettingsOpen(false);
    return () => {
      settingsModalTrigger.open = () => {};
      settingsModalTrigger.close = () => {};
    };
  }, []);

  const cycleTheme = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  const getThemeLabel = () => {
    if (theme === "system") return t.themeSystem || "System";
    if (theme === "light") return t.themeLight || "Light";
    return t.themeDark || "Dark";
  };

  const dynamicText = isDark ? "#f5f5f5" : "#171717";

  return (
    <Modal
      visible={isSettingsOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsSettingsOpen(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setIsSettingsOpen(false)}
        style={styles.modalBackdrop}
      >
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDark ? "#171717" : "#ffffff",
              borderColor: isDark ? "#262626" : "#e5e5e5",
            },
          ]}
        >
          <Text style={[styles.modalTitle, { color: dynamicText }]}>
            {t.settingsTitle}
          </Text>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              toggleLocale();
            }}
            style={styles.settingRow}
          >
            <Globe size={18} color="#737373" style={{ marginRight: 10 }} />
            <Text
              style={{
                color: dynamicText,
                flex: 1,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              {t.changeLanguage}
            </Text>
            <Text style={{ color: "#737373", fontSize: 12 }}>
              {locale === "en" ? "English" : "فارسی"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              cycleTheme();
            }}
            style={styles.settingRowdown}
          >
            {theme === "system" ? (
              <Settings size={18} color="#737373" style={{ marginRight: 10 }} />
            ) : isDark ? (
              <Moon size={18} color="#737373" style={{ marginRight: 10 }} />
            ) : (
              <Sun size={18} color="#eab308" style={{ marginRight: 10 }} />
            )}
            <Text
              style={{
                color: dynamicText,
                flex: 1,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              {t.toggleTheme}
            </Text>
            <Text style={{ color: "#737373", fontSize: 12 }}>
              {getThemeLabel()}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: { width: 280, borderRadius: 20, borderWidth: 1, padding: 20 },
  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 16,
    textAlign: "center",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#26262620",
  },
  settingRowdown: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
});
