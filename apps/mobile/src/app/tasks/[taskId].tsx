import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme as useSystemColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useTasksQuery, useUpdateTaskMutation, Task } from "@/hooks/useTasks";
import { useProjectsQuery } from "@/hooks/useProjects";
import { Badge } from "@/components/atoms/Badge";
import { EditableTextField } from "@/components/molecules/EditableTextField";
import { PriorityPicker } from "@/components/molecules/PriorityPicker";
import { ArrowLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { RichTextEditor } from "@/components/atoms/RichTextEditor";

export default function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const { t, theme } = useApp();
  const systemTheme = useSystemColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  const { data: tasks = [], isLoading } = useTasksQuery();
  const { data: projects = [] } = useProjectsQuery();
  const updateTaskMutation = useUpdateTaskMutation();

  const task = React.useMemo(() => {
    return tasks.find((t: Task) => t.id === taskId);
  }, [tasks, taskId]);

  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    if (task) {
      setDescription(task.description || "");
    }
  }, [task]);

  const handleUpdateDescription = React.useCallback(
    (targetDesc: string) => {
      if (task && targetDesc !== (task.description || "")) {
        updateTaskMutation.mutate(
          { id: task.id, description: targetDesc } as any,
          {
            onSuccess: () =>
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              ),
          },
        );
      }
    },
    [task, updateTaskMutation],
  );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      handleUpdateDescription(description);
    });
    return unsubscribe;
  }, [navigation, description, handleUpdateDescription]);

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

  const relatedProject = projects.find((p) => p.id === task.projectId);
  const projectLabel = relatedProject
    ? relatedProject.title
    : t.noProject || "No Project";
  const projectVariant = relatedProject ? "primary" : "secondary";

  const dynamicBg = isDark ? "#0a0a0a" : "#f5f5f5";
  const labelColorClass = isDark ? "text-neutral-400" : "text-neutral-600";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: dynamicBg }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}>
        <View className="flex-row items-center justify-between mb-8 shrink-0">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={{ backgroundColor: "#171717", borderColor: "#262626" }}
            className="h-10 w-10 border rounded-full items-center justify-center active:bg-neutral-800"
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
            isDark={isDark}
          />
        </View>

        <View className="mb-8">
          <Text className="text-[10px] font-black uppercase text-neutral-500 tracking-wider mb-3">
            {t.descriptionLabel}
          </Text>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder={t.noDescription || "..."}
          />
        </View>

        <View className="space-y-4">
          <View className="flex-row items-center justify-between">
            <Text className={`text-xs font-bold ${labelColorClass}`}>
              {t.projectTag}
            </Text>
            <Badge label={projectLabel} variant={projectVariant as any} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
