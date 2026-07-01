import * as React from "react";
import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTasksQuery, useUpdateTaskMutation, Task } from "@/hooks/useTasks";
import { useMobileTranslation } from "@/hooks/useMobileTranslation";
import { Badge } from "@/components/atoms/Badge";
import { RichTextRenderer } from "@/components/atoms/RichTextRenderer";
import { EditableTextField } from "@/components/molecules/EditableTextField";
import { PriorityPicker } from "@/components/molecules/PriorityPicker";
import { ArrowLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { t } = useMobileTranslation();

  const { data: tasks = [], isLoading } = useTasksQuery();
  const updateTaskMutation = useUpdateTaskMutation();

  const task = React.useMemo(() => {
    return tasks.find((t: Task) => t.id === taskId);
  }, [tasks, taskId]);

  if (isLoading || !task) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-950">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  const handleUpdateTitle = (newTitle: string) => {
    updateTaskMutation.mutate({ id: task.id, title: newTitle } as any, {
      onSuccess: () =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    });
  };

  const handleUpdatePriority = (newPriority: any) => {
    updateTaskMutation.mutate({ id: task.id, priority: newPriority } as any, {
      onSuccess: () =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    });
  };

  const priorityLabels = {
    LOW: t.priorityLow || "Low",
    MEDIUM: t.priorityMedium || "Medium",
    HIGH: t.priorityHigh || "High",
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}
    >
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="h-10 w-10 border border-neutral-800 bg-neutral-900/40 rounded-full items-center justify-center active:bg-neutral-800"
          >
            <ArrowLeft size={18} color="#a3a3a3" />
          </TouchableOpacity>
          <Text
            className={`text-md font-bold ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
          >
            {t.taskDetailsTitle}
          </Text>
          <View className="w-10" />
        </View>

        <View className="mb-6">
          <Text className="text-[10px] font-black uppercase text-neutral-500 tracking-wider mb-1">
            {t.taskTitleLabel}
          </Text>
          <EditableTextField
            value={task.title}
            onSave={handleUpdateTitle}
            placeholder="..."
          />
        </View>

        <View className="mb-6">
          <Text className="text-[10px] font-black uppercase text-neutral-500 tracking-wider mb-2">
            {t.priorityLabel}
          </Text>
          <PriorityPicker
            value={task.priority}
            onChange={handleUpdatePriority}
            labels={priorityLabels}
          />
        </View>

        <View className="mb-8">
          <Text className="text-[10px] font-black uppercase text-neutral-500 tracking-wider mb-3">
            {t.descriptionLabel}
          </Text>
          <View
            className={`p-4 border rounded-xl min-h-24 ${isDark ? "border-neutral-800 bg-neutral-900/30" : "border-neutral-200 bg-white"}`}
          >
            <RichTextRenderer
              text={task.description}
              placeholder={t.noDescription}
            />
          </View>
        </View>

        <View className="space-y-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-neutral-500 font-bold">
              {t.projectTag}
            </Text>
            <Badge label="E-Commerce API" variant="warning" />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-neutral-500 font-bold">
              {t.clientTag}
            </Text>
            <Badge label="TechCorp Inc." variant="success" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
