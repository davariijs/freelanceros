import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { cn } from "@/lib/utils";

type Priority = "LOW" | "MEDIUM" | "HIGH";

interface PriorityPickerProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  labels: { LOW: string; MEDIUM: string; HIGH: string };
  isDark: boolean;
}

export const PriorityPicker: React.FC<PriorityPickerProps> = ({
  value,
  onChange,
  labels,
  isDark,
}) => {
  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH"];

  const getVariantStyles = (item: Priority, isActive: boolean) => {
    if (!isActive) {
      return isDark
        ? "border-neutral-800 bg-neutral-900/50 text-neutral-500"
        : "border-neutral-300 bg-white text-neutral-400";
    }

    switch (item) {
      case "LOW":
        return "bg-emerald-500 text-white border-emerald-500";
      case "MEDIUM":
        return "bg-amber-500 text-white border-amber-500";
      case "HIGH":
        return "bg-red-500 text-white border-red-500";
    }
  };

  const handleSelect = (item: Priority) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(item);
  };

  return (
    <View className="flex-row items-center space-x-2">
      {priorities.map((item: Priority) => {
        const isActive = item === value;
        return (
          <TouchableOpacity
            key={item}
            onPress={() => handleSelect(item)}
            className={cn(
              "px-3.5 py-2 rounded-xl border items-center justify-center min-w-16",
              getVariantStyles(item, isActive),
            )}
          >
            <Text
              className={`text-xs font-black uppercase ${isActive ? (isDark ? "text-neutral-950" : "text-white") : "text-neutral-500"}`}
            >
              {labels[item]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
