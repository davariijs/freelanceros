import * as React from "react";
import { View, Text, useColorScheme, SafeAreaView } from "react-native";
import { SyncStatus } from "@/components/atoms/SyncStatus";
import { CircularProgress } from "@/components/atoms/CircularProgress";
import { TodayTasksList } from "@/components/organisms/TodayTasksList";
import { useMobileTranslation } from "@/hooks/useMobileTranslation";
import { useTasksQuery, useUpdateTaskMutation, Task } from "@/hooks/useTasks";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { t } = useMobileTranslation();

  const { data: tasks = [], isLoading } = useTasksQuery();
  const updateTaskMutation = useUpdateTaskMutation();

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
    router.push({
      pathname: "/task-detail",
      params: { id: task.id },
    });
  };

  const todayDateString = React.useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}
    >
      <View className="flex-1 px-5 pt-4">
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
          <SyncStatus />
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
          <View className="flex-1 justify-center items-center">
            <Text className="text-xs text-neutral-500 font-semibold">
              {t.loadingFocus}
            </Text>
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
    </SafeAreaView>
  );
}
