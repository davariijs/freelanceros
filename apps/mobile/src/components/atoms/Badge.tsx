import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = "primary" }) => {
  const bgBorderStyles = {
    primary: "bg-blue-500/10 border-blue-500/20",
    secondary: "bg-neutral-500/10 border-neutral-500/20",
    success: "bg-emerald-500/10 border-emerald-500/20",
    warning: "bg-amber-500/10 border-amber-500/20",
    danger: "bg-red-500/10 border-red-500/20",
  };

  const textStyles = {
    primary: "text-blue-500",
    secondary: "text-neutral-400",
    success: "text-emerald-500",
    warning: "text-amber-500",
    danger: "text-red-500",
  };

  return (
    <View
      className={cn(
        "px-2.5 py-1 rounded-full border self-start",
        bgBorderStyles[variant],
      )}
    >
      <Text
        className={cn(
          "text-[10px] font-black uppercase tracking-wider text-center",
          textStyles[variant],
        )}
      >
        {label}
      </Text>
    </View>
  );
};
