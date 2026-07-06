import * as React from "react";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface ProjectChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const ProjectChip: React.FC<ProjectChipProps> = ({
  label,
  isActive,
  onPress,
}) => {
  const { theme } = useApp();
  const systemTheme = useColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  const getContainerStyle = () => {
    if (isActive) {
      return isDark
        ? "bg-neutral-100 border-neutral-100"
        : "bg-neutral-900 border-neutral-900";
    }
    return isDark
      ? "bg-neutral-900 border-neutral-800"
      : "bg-neutral-200/60 border-neutral-300";
  };

  const getTextStyle = () => {
    if (isActive) {
      return isDark ? "text-neutral-950" : "text-white";
    }
    return "text-neutral-500";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "px-4 py-2 rounded-xl border mr-2 items-center justify-center",
        getContainerStyle(),
      )}
    >
      <Text className={cn("text-xs font-bold", getTextStyle())}>{label}</Text>
    </TouchableOpacity>
  );
};
