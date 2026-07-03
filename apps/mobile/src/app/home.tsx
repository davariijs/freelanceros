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
    quickAddSheetRef.current?.snapToIndex(0);
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

  const dynamicBg = isDark ? "#0a0a0a" : "#f5f5f5";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: dynamicBg }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 16,
          position: "relative",
        }}
      >
        <View className="flex-row justify-between items-center mb-6 shrink-0">
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
          className={`p-5 rounded-2xl flex-row justify-between items-center mb-6 border shrink-0 ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"}`}
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

        <View className="flex-1 min-h-0">
          {isLoading ? (
            <View className="space-y-2">
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
        </View>

        <TouchableOpacity
          onPress={handleOpenQuickAdd}
          className={`absolute bottom-6 right-6 h-14 w-14 rounded-full justify-center items-center shadow-lg z-50 ${
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
