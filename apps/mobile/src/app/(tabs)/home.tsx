import * as React from "react";
import { View, Text, TouchableOpacity, InteractionManager } from "react-native";
import { SyncStatus } from "@/components/ui/SyncStatus";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { TodayTasksList } from "@/features/tasks/components/TodayTasksList";
import {
  useTasksQuery,
  useUpdateTaskMutation,
  Task,
  TaskStatus,
} from "@/features/tasks/hooks/useTasks";
import { useProjectsQuery } from "@/features/projects/hooks/useProjects";
import { useRouter, useFocusEffect } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { QuickAddSheet } from "@/features/tasks/components/QuickAddSheet";
import { SearchBar } from "@/components/ui/SearchBar";
import { Plus, LogOut, Search } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveAppRefetch } from "@/hooks/useActiveAppRefetch";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApp } from "@/context/AppContext";
import { widgetSync } from "@/services/widgetSync";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { notificationService } from "@/services/notificationService";
import { secureStore } from "@/services/secureStore";

export default function HomeScreen() {
  const router = useRouter();
  const { t, isDark, isCommandOpen, setIsCommandOpen, user, setUser } =
    useApp();
  const insets = useSafeAreaInsets();

  const { data: tasks = [], isLoading, refetch } = useTasksQuery();
  const { data: projects = [] } = useProjectsQuery();
  const updateTaskMutation = useUpdateTaskMutation();

  const quickAddSheetRef = React.useRef<BottomSheet>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  React.useEffect(() => {
    notificationService.registerForPushNotificationsAsync();
  }, []);

  React.useEffect(() => {
    if (projects.length > 0) {
      InteractionManager.runAfterInteractions(() => {
        notificationService.scheduleProjectDeadlineNotifications(projects, t);
      });
    }
  }, [projects, t]);

  React.useEffect(() => {
    if (isCommandOpen) {
      quickAddSheetRef.current?.snapToIndex(0);
    } else {
      quickAddSheetRef.current?.close();
    }
  }, [isCommandOpen]);

  const handleOpenQuickAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsCommandOpen(true);
  };

  const handleCloseQuickAdd = () => {
    refetch();
    setIsCommandOpen(false);
  };

  const handleLogout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      console.log("Google SignOut info:", e);
    }
    await secureStore.clearTokens();
    await AsyncStorage.removeItem("user");
    setUser(null);
    await AsyncStorage.setItem("isAppLocked", "true");
    router.replace("/login");
  };

  const todayTasks = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const baseTasks = q
      ? tasks.filter(
          (t: Task) =>
            t.title.toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q)),
        )
      : [...tasks];

    return baseTasks.sort((a: Task, b: Task) => {
      if (a.status === "DONE" && b.status !== "DONE") return 1;
      if (a.status !== "DONE" && b.status === "DONE") return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, searchQuery]);

  const progressPercent = React.useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t: Task) => t.status === "DONE").length;
    return (completed / tasks.length) * 100;
  }, [tasks]);

  const handleCompleteTask = (id: string, status: TaskStatus) => {
    updateTaskMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
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

  React.useEffect(() => {
    if (tasks.length > 0) {
      widgetSync.syncTodayTasks(tasks);
    }
  }, [tasks]);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const dynamicBg = isDark ? "#0a0a0a" : "#f5f5f5";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: dynamicBg,
        paddingTop: insets.top + 16,
      }}
    >
      <View style={{ flex: 1, paddingHorizontal: 20, position: "relative" }}>
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
            {user?.email && (
              <Text className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold mt-0.5">
                {user.email}
              </Text>
            )}
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsSearchOpen(true);
              }}
              style={{
                backgroundColor: isDark ? "#171717" : "#ffffff",
                borderColor: isDark ? "#262626" : "#e5e5e5",
              }}
              className="h-8 w-8 border rounded-full items-center justify-center active:bg-neutral-800 mr-2"
              aria-label="Search"
            >
              <Search size={14} color="#a3a3a3" />
            </TouchableOpacity>
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

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t.placeholderSearchTasks || "Search tasks..."}
          isOpen={isSearchOpen}
          onClose={handleCloseSearch}
          isDark={isDark}
        />

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
            isDark={isDark}
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
              onUpdateStatus={handleCompleteTask}
              onTaskPress={handleTaskPress}
            />
          )}
        </View>

        {!isCommandOpen && (
          <TouchableOpacity
            onPress={handleOpenQuickAdd}
            className="absolute bottom-6 right-6 h-14 w-14 rounded-full justify-center items-center shadow-lg z-30 bg-emerald-500 active:bg-emerald-600"
          >
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        )}

        <QuickAddSheet ref={quickAddSheetRef} onSuccess={handleCloseQuickAdd} />
      </View>
    </View>
  );
}
