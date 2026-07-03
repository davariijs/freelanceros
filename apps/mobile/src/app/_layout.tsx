import * as React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationService } from "@/services/notificationService";
import { useMobileTranslation } from "@/hooks/useMobileTranslation";
import { ErrorBoundary } from "@/components/organisms/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "../../global.css";

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
        <AppProvider initialLocale="en" initialTheme="dark">
          <QueryClientProvider client={queryClient}>
            <BottomSheetModalProvider>
              <StatusBar style="auto" />
              <AppContent />
            </BottomSheetModalProvider>
          </QueryClientProvider>
        </AppProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { t } = useMobileTranslation();

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
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0a0a0a" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
      <Stack.Screen name="tasks/[taskId]" />
      <Stack.Screen name="quick-add" />
    </Stack>
  );
}
