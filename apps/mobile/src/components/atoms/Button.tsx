import * as React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  isDark?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = "primary",
  className = "",
  disabled = false,
  loading = false,
  isDark = false,
}) => {
  const getButtonClass = () => {
    if (variant === "ghost") {
      return "h-11 justify-center items-center px-4 rounded-xl active:bg-neutral-500/10";
    }
    if (variant === "secondary") {
      return `h-11 justify-center items-center px-4 rounded-xl border ${
        isDark
          ? "bg-neutral-900 border-neutral-800 active:bg-neutral-800"
          : "bg-neutral-100 border-neutral-200 active:bg-neutral-200"
      }`;
    }
    return `h-11 justify-center items-center px-4 rounded-xl ${
      isDark
        ? "bg-neutral-100 active:bg-neutral-200"
        : "bg-neutral-950 active:bg-neutral-800"
    }`;
  };

  const getTextColor = () => {
    if (variant === "ghost") {
      return isDark ? "text-neutral-400" : "text-neutral-600";
    }
    if (variant === "secondary") {
      return isDark ? "text-neutral-300" : "text-neutral-700";
    }
    return isDark ? "text-neutral-950" : "text-white";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={{ opacity: disabled ? 0.5 : 1 }}
      className={`${getButtonClass()} ${className}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isDark && variant === "primary" ? "#0a0a0a" : "#ffffff"}
        />
      ) : typeof children === "string" ? (
        <Text className={`text-xs font-bold ${getTextColor()}`}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};
