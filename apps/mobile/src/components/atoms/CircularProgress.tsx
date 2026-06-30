import * as React from "react";
import { View, Text } from "react-native";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 50,
  strokeWidth = 5,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <View
        className="absolute rounded-full border justify-center items-center"
        style={{
          width: size,
          height: size,
          borderColor: "#262626",
          borderWidth: strokeWidth,
        }}
      />
      <View
        className="absolute rounded-full border justify-center items-center"
        style={{
          width: size,
          height: size,
          borderColor: "#10b981",
          borderWidth: strokeWidth,
          transform: [{ rotate: "-90deg" }],
          borderLeftColor: "transparent",
          borderBottomColor: "transparent",
        }}
      />
      <Text className="text-xs font-black text-neutral-100">
        {Math.round(progress)}%
      </Text>
    </View>
  );
};
