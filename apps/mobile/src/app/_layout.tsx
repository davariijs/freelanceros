import * as React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationService } from "@/services/notificationService";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import "../../global.css";
import { AppProvider, useApp } from "@/context/AppContext";
import { useColorScheme } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppProvider initialLocale="en" initialTheme="dark">
            <AppContent />
          </AppProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { t, theme } = useApp();
  const systemTheme = useColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  useNotifications();

  React.useEffect(() => {
    async function setupNotifications() {
      await notificationService.registerForPushNotificationsAsync();
      await notificationService.scheduleDailyReminder(
        t.reminderTitle || "Focus Reminder",
        t.reminderBody || "Keep pushing forward!",
      );
    }
    setupNotifications();
  }, [t]);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5",
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="register-verify" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tasks/[taskId]" />
        <Stack.Screen name="quick-add" />
      </Stack>
    </>
  );
}
