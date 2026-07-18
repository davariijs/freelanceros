import * as React from "react";
import { View, TouchableOpacity, useColorScheme } from "react-native";
import { useApp, settingsModalTrigger } from "@/context/AppContext";
import { Home, Users, FolderGit2, Bell, Settings } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface BottomTabRoute {
  name: string;
}

interface BottomTabState {
  index: number;
  routes: BottomTabRoute[];
}

interface BottomTabNavigation {
  navigate: (routeName: string) => void;
}

interface BottomTabBarProps {
  state: BottomTabState;
  navigation: BottomTabNavigation;
}

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const { theme } = useApp();
  const systemTheme = useColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  const handleTabPress = (route: string, isSettings = false) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isSettings) {
      settingsModalTrigger.open();
    } else {
      navigation.navigate(route);
    }
  };

  const isTabActive = (route: string) => {
    const activeRoute = state.routes[state.index];
    return activeRoute.name === route;
  };

  const activeColor = "#10b981";
  const inactiveColor = "#737373";

  return (
    <View
      className={`h-16 flex-row border-t items-center justify-around px-2 pb-1 shrink-0 ${
        isDark
          ? "bg-neutral-950 border-neutral-900"
          : "bg-white border-neutral-200"
      }`}
    >
      <TouchableOpacity
        onPress={() => handleTabPress("clients")}
        className="items-center justify-center flex-1 py-1"
      >
        <Users
          size={18}
          color={isTabActive("clients") ? activeColor : inactiveColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress("projects")}
        className="items-center justify-center flex-1 py-1"
      >
        <FolderGit2
          size={18}
          color={isTabActive("projects") ? activeColor : inactiveColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress("home")}
        className="items-center justify-center flex-1 py-1"
      >
        <Home
          size={18}
          color={isTabActive("home") ? activeColor : inactiveColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress("notifications")}
        className="items-center justify-center flex-1 py-1"
      >
        <Bell
          size={18}
          color={isTabActive("notifications") ? activeColor : inactiveColor}
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
