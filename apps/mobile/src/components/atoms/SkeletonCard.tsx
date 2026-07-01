import * as React from "react";
import { View, Animated, useColorScheme } from "react-native";

export const SkeletonCard: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const shimmerOpacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmerOpacity]);

  return (
    <Animated.View
      style={{ opacity: shimmerOpacity }}
      className={`p-4 rounded-2xl border my-1 flex-row items-center justify-between h-19 ${
        isDark
          ? "bg-neutral-900 border-neutral-800/80"
          : "bg-white border-neutral-200/80"
      }`}
    >
      <View className="flex-1 space-y-2 pr-4">
        <View
          className={`h-4 w-2/3 rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-200"}`}
        />
        <View
          className={`h-3 w-1/2 rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-200"}`}
        />
      </View>
      <View
        className={`h-5 w-12 rounded-full ${isDark ? "bg-neutral-800" : "bg-neutral-200"}`}
      />
    </Animated.View>
  );
};
