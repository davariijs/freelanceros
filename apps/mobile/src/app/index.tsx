import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { secureStore } from "@/services/secureStore";

export default function IndexScreen() {
  const router = useRouter();

  React.useEffect(() => {
    async function checkAuthStatus() {
      try {
        const token = await secureStore.getToken();
        if (token) {
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      }
    }

    checkAuthStatus();
  }, []);

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
