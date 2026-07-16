import * as React from "react";
import { View, Text, ScrollView, useColorScheme, ActivityIndicator } from "react-native";
import { useApp } from "@/context/AppContext";
import { useProjectsQuery } from "@/hooks/useProjects";
import { formatDateStrict, toPersianDigits } from "@/utils/dateConverter";
import { BottomTabBar } from "@/components/molecules/BottomTabBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, AlertTriangle, BellRing, Info } from "lucide-react-native";

export default function NotificationsScreen() {
  const { t, theme, locale } = useApp();
  const systemTheme = useColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";
  const isJalali = locale === "fa";

  const { data: projects = [], isLoading } = useProjectsQuery();

  const deadlineNotifications = React.useMemo(() => {
    const list: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    projects.forEach((proj) => {
      if (!proj.dueDate) return;

      const dueDate = new Date(proj.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate.getTime() === today.getTime()) {
        list.push({
          id: `${proj.id}_today`,
          action: "PROJECT_DEADLINE_TODAY",
          title: proj.title,
          createdAt: proj.dueDate,
        });
      } else if (dueDate.getTime() === tomorrow.getTime()) {
        list.push({
          id: `${proj.id}_tomorrow`,
          action: "PROJECT_DEADLINE_TOMORROW",
          title: proj.title,
          createdAt: proj.dueDate,
        });
      }
    });

    return list;
  }, [projects]);

  const getActionLabel = (action: string, title: string) => {
    if (action === "PROJECT_DEADLINE_TOMORROW") {
      return t.activityProjectDeadlineTomorrow
        ? t.activityProjectDeadlineTomorrow.replace("{title}", title)
        : `Tomorrow is the deadline for: ${title}`;
    }
    return t.activityProjectDeadlineToday
      ? t.activityProjectDeadlineToday.replace("{title}", title)
      : `Today is the deadline for: ${title}!`;
  };

  const getActionIcon = (action: string) => {
    if (action === "PROJECT_DEADLINE_TOMORROW") {
      return <AlertTriangle size={18} color="#eab308" />;
    }
    return <BellRing size={18} color="#ef4444" />;
  };

  const formatActivityTime = (isoString: string) => {
    const date = new Date(isoString);
    const datePart = formatDateStrict(isoString, isJalali);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const timePart = `${hours}:${minutes}`;
    const formatted = `${datePart} - ${timePart}`;
    return isJalali ? toPersianDigits(formatted) : formatted;
  };

  const dynamicBg = isDark ? "#0a0a0a" : "#f5f5f5";
  const cardBg = isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: dynamicBg }}>
      <View style={{ flex: 1, paddingTop: 16 }}>
        <View className="px-5 mb-6 shrink-0 flex-row items-center gap-3">
          <Bell size={24} color={isDark ? "#ffffff" : "#000000"} />
          <Text className={`text-2xl font-black ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>
            {t.notifications || "Notifications"}
          </Text>
        </View>

        <View className="flex-1 px-5">
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#10b981" />
            </View>
          ) : deadlineNotifications.length === 0 ? (
            <View className="flex-1 justify-center items-center py-12">
              <Info size={36} color="#737373" className="mb-2" />
              <Text className="text-sm text-neutral-500 text-center">
                {t.noDeadlineNotifications || "No upcoming project deadlines."}
              </Text>
            </View>
          ) : (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="gap-y-4 pb-8">
                {deadlineNotifications.map((item) => (
                  <View key={item.id} className={`p-4 rounded-2xl border flex-row items-start gap-4 ${cardBg}`}>
                    <View className="h-9 w-9 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center shrink-0">
                      {getActionIcon(item.action)}
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className={`text-sm font-bold leading-relaxed ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>
                        {getActionLabel(item.action, item.title)}
                      </Text>
                      <Text className="text-[10px] text-neutral-500 mt-1">
                        {formatActivityTime(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        <BottomTabBar />
      </View>
    </SafeAreaView>
  );
}