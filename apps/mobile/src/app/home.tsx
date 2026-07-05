import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { SyncStatus } from "@/components/atoms/SyncStatus";
import { CircularProgress } from "@/components/atoms/CircularProgress";
import { TodayTasksList } from "@/components/organisms/TodayTasksList";
import { useTasksQuery, useUpdateTaskMutation, Task } from "@/hooks/useTasks";
import { useRouter } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { QuickAddSheet } from "@/components/organisms/QuickAddSheet";
import { Plus, LogOut, Settings, Globe, Sun, Moon } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActiveAppRefetch } from "@/hooks/useActiveAppRefetch";
import { SkeletonCard } from "@/components/atoms/SkeletonCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApp } from "@/context/AppContext";
import { widgetSync } from "@/services/widgetSync";

export default function HomeScreen() {
  const router = useRouter();
  const { toggleLocale, setTheme, theme, locale, t } = useApp();
  const isDark = theme === "dark";

  const { data: tasks = [], isLoading } = useTasksQuery();
  const updateTaskMutation = useUpdateTaskMutation();

  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
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

  React.useEffect(() => {
    if (tasks.length > 0) {
      widgetSync.syncTodayTasks(tasks);
    }
  }, [tasks]);

  const dynamicBg = isDark ? "#0a0a0a" : "#f5f5f5";
  const dynamicText = isDark ? "#f5f5f5" : "#171717";

  const cycleTheme = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  const getThemeLabel = () => {
    if (theme === "system") return t.themeSystem || "System";
    if (theme === "light") return t.themeLight || "Light";
    return t.themeDark || "Dark";
  };

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
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsSettingsOpen(true);
              }}
              className="h-8 w-8 rounded-full border border-neutral-800 bg-neutral-900 justify-center items-center active:bg-neutral-800 ml-2"
            >
              <Settings size={14} color="#a3a3a3" />
            </TouchableOpacity>
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

        <Modal
          visible={isSettingsOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsSettingsOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsSettingsOpen(false)}
            style={styles.modalBackdrop}
          >
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: isDark ? "#171717" : "#ffffff",
                  borderColor: isDark ? "#262626" : "#e5e5e5",
                },
              ]}
            >
              <Text style={[styles.modalTitle, { color: dynamicText }]}>
                {t.settingsTitle}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  toggleLocale();
                }}
                style={styles.settingRow}
              >
                <Globe size={18} color="#737373" style={{ marginRight: 10 }} />
                <Text
                  style={{
                    color: dynamicText,
                    flex: 1,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {t.changeLanguage}
                </Text>
                <Text style={{ color: "#737373", fontSize: 12 }}>
                  {locale === "en" ? "English" : "فارسی"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  cycleTheme();
                }}
                style={styles.settingRow}
              >
                {theme === "system" ? (
                  <Settings
                    size={18}
                    color="#737373"
                    style={{ marginRight: 10 }}
                  />
                ) : isDark ? (
                  <Moon size={18} color="#737373" style={{ marginRight: 10 }} />
                ) : (
                  <Sun size={18} color="#eab308" style={{ marginRight: 10 }} />
                )}
                <Text
                  style={{
                    color: dynamicText,
                    flex: 1,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {t.toggleTheme}
                </Text>
                <Text style={{ color: "#737373", fontSize: 12 }}>
                  {getThemeLabel()}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: { width: 280, borderRadius: 20, borderWidth: 1, padding: 20 },
  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 16,
    textAlign: "center",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#26262620",
  },
});
