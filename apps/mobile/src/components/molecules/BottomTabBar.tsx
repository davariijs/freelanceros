import * as React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useApp } from "@/context/AppContext";
import { Home, Users, FileText, Bell, Settings } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, t, setIsSettingsOpen } = useApp();
  const systemTheme = useColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  const handleTabPress = (route: string, isSettings = false) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isSettings) {
      setIsSettingsOpen(true);
    } else {
      router.push(route as any);
    }
  };

  const isTabActive = (route: string) => pathname === route;

  const activeColor = "#10b981";
  const inactiveColor = "#737373";

  return (
    <View
      className={`h-16 flex-row border-t items-center justify-around px-2 pb-1 shrink-0 ${isDark ? "bg-neutral-950 border-neutral-900" : "bg-white border-neutral-200"}`}
    >
      <TouchableOpacity
        onPress={() => handleTabPress("/clients")}
        className="items-center justify-center flex-1 py-1"
      >
        <Users
          size={18}
          color={isTabActive("/clients") ? activeColor : inactiveColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress("/notes")}
        className="items-center justify-center flex-1 py-1"
      >
        <FileText
          size={18}
          color={isTabActive("/notes") ? activeColor : inactiveColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress("/home")}
        className="items-center justify-center flex-1 py-1"
      >
        <Home
          size={18}
          color={isTabActive("/home") ? activeColor : inactiveColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress("/notifications")}
        className="items-center justify-center flex-1 py-1"
      >
        <Bell
          size={18}
          color={isTabActive("/notifications") ? activeColor : inactiveColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress("", true)}
        className="items-center justify-center flex-1 py-1"
      >
        <Settings size={18} color={inactiveColor} />
      </TouchableOpacity>
    </View>
  );
}
