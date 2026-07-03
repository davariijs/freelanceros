import * as React from "react";
import { Text, TouchableOpacity } from "react-native";
import { cn } from "@/lib/utils";

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
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "px-3.5 py-2 rounded-xl border mr-2 items-center justify-center",
        isActive
          ? "bg-neutral-100 border-neutral-100 dark:bg-neutral-100 dark:border-neutral-100"
          : "bg-neutral-900 border-neutral-800 dark:bg-neutral-900/50",
      )}
    >
      <Text
        className={cn(
          "text-xs font-bold",
          isActive ? "text-neutral-950" : "text-neutral-500",
        )}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
