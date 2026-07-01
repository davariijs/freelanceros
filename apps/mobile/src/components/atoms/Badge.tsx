import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = "primary" }) => {
  const variantStyles = {
    primary: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    secondary: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <View
      className={cn(
        "px-2.5 py-1 rounded-full border self-start",
        variantStyles[variant],
      )}
    >
      <Text className="text-[10px] font-black uppercase tracking-wider text-center">
        {label}
      </Text>
    </View>
  );
};
