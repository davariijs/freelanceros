import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { cn } from "@/lib/utils";

type Priority = "LOW" | "MEDIUM" | "HIGH";

interface PriorityPickerProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  labels: { LOW: string; MEDIUM: string; HIGH: string };
}

export const PriorityPicker: React.FC<PriorityPickerProps> = ({
  value,
  onChange,
  labels,
}) => {
  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH"];

  const getVariantStyles = (item: Priority, isActive: boolean) => {
    if (!isActive) return "border-neutral-800 bg-neutral-900/50";

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
              "px-3.5 py-2 rounded-xl border items-center justify-center min-w-16 active:scale-95 transition-transform",
              getVariantStyles(item, isActive),
            )}
          >
            <Text
              className={cn(
                "text-xs font-bold",
                isActive ? "text-white" : "text-neutral-500",
              )}
            >
              {labels[item]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
