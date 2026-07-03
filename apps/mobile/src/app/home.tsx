import * as React from "react";
import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
import { SyncStatus } from "@/components/atoms/SyncStatus";
import { CircularProgress } from "@/components/atoms/CircularProgress";
import { TodayTasksList } from "@/components/organisms/TodayTasksList";
import { useMobileTranslation } from "@/hooks/useMobileTranslation";
import { useTasksQuery, useUpdateTaskMutation, Task } from "@/hooks/useTasks";
import { useRouter } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { QuickAddSheet } from "@/components/organisms/QuickAddSheet";
import { Plus, LogOut } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActiveAppRefetch } from "@/hooks/useActiveAppRefetch";
import { SkeletonCard } from "@/components/atoms/SkeletonCard";
import { secureStore } from "@/services/secureStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { t } = useMobileTranslation();

  const { data: tasks = [], isLoading } = useTasksQuery();
  const updateTaskMutation = useUpdateTaskMutation();

  const quickAddSheetRef = React.useRef<BottomSheet>(null);

  const handleOpenQuickAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    quickAddSheetRef.current?.expand();
  };

  const handleCloseQuickAdd = () => {
    quickAddSheetRef.current?.close();
  };

  const handleLogout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await AsyncStorage.setItem("isAppLocked", "true");
    router.replace("/login");
  };

  const todayTasks = React.useMemo(() => {
    return tasks.filter((task: Task) => task.status !== "DONE");
  }, [tasks]);

  const progressPercent = React.useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t: Task) => t.status === "DONE").length;
    return (completed / tasks.length) * 100;
  }, [tasks]);

  const handleCompleteTask = (id: string) => {
    updateTaskMutation.mutate({ id, status: "DONE" });
  };

  const handleSnoozeTask = (id: string) => {
    updateTaskMutation.mutate({ id, status: "TODO" });
  };

  const handleTaskPress = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  const todayDateString = React.useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);

  useActiveAppRefetch();

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}
    >
      <View className="flex-1 px-5 pt-4 relative">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {todayDateString}
            </Text>
            <Text
              className={`text-2xl font-black ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
            >
              {t.todayTasksTitle}
            </Text>
          </View>

          <View className="flex-row items-center">
            <SyncStatus />
            <TouchableOpacity
              onPress={handleLogout}
              className="h-8 w-8 rounded-full border border-neutral-800 bg-neutral-900 justify-center items-center active:bg-neutral-800 ml-2"
              aria-label="Log Out"
            >
              <LogOut size={14} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View
          className={`p-5 rounded-2xl flex-row justify-between items-center mb-6 border ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"}`}
        >
          <View>
            <Text
              className={`text-sm font-bold ${isDark ? "text-neutral-200" : "text-neutral-800"}`}
            >
              {t.dailyProgress}
            </Text>
            <Text className="text-xs text-neutral-500">{t.keepPushing}</Text>
          </View>
          <CircularProgress
            progress={progressPercent}
            size={60}
            strokeWidth={6}
          />
        </View>

        {isLoading ? (
          <View className="flex-1 space-y-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <TodayTasksList
            tasks={todayTasks}
            onComplete={handleCompleteTask}
            onSnooze={handleSnoozeTask}
            onTaskPress={handleTaskPress}
          />
        )}
        <TouchableOpacity
          onPress={handleOpenQuickAdd}
          className={`absolute bottom-6 right-6 h-14 w-14 rounded-full justify-center items-center shadow-lg active:scale-90 transition-transform ${
            isDark ? "bg-neutral-100" : "bg-neutral-950"
          }`}
        >
          <Plus size={24} color={isDark ? "#0a0a0a" : "#ffffff"} />
        </TouchableOpacity>
        <QuickAddSheet ref={quickAddSheetRef} onSuccess={handleCloseQuickAdd} />
      </View>
    </SafeAreaView>
  );
}
