import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";

export default function QuickAddRedirectScreen() {
  const router = useRouter();
  const { setIsCommandOpen } = useApp();

  React.useEffect(() => {
    setIsCommandOpen(true);

    router.replace("/home");
  }, [setIsCommandOpen, router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0a0a0a",
      }}
    >
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}
