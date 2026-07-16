import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme as useSystemColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import {
  useTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  Task,
} from "@/hooks/useTasks";
import { useProjectsQuery } from "@/hooks/useProjects";
import { Badge } from "@/components/atoms/Badge";
import { EditableTextField } from "@/components/molecules/EditableTextField";
import { PriorityPicker } from "@/components/molecules/PriorityPicker";
import { ArrowLeft, Trash2, Check, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { RichTextEditor } from "@/components/atoms/RichTextEditor";
import { formatDateTimeStrict } from "@/utils/dateConverter";

export default function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const { t, theme, locale } = useApp();
  const systemTheme = useSystemColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";
  const isJalali = locale === "fa";

  const { data: tasks = [], isLoading } = useTasksQuery();
  const { data: projects = [] } = useProjectsQuery();
  const updateTaskMutation = useUpdateTaskMutation();

  const deleteTaskMutation = useDeleteTaskMutation();
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

  const task = React.useMemo(() => {
    return tasks.find((t: Task) => t.id === taskId);
  }, [tasks, taskId]);

  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    if (task) {
      setDescription(task.description || "");
    }
  }, [task]);

  const formattedCreationDate = React.useMemo(() => {
    if (!task?.createdAt) return "";
    return formatDateTimeStrict(task.createdAt, isJalali);
  }, [task?.createdAt, isJalali]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!task || description === (task.description || "")) {
        return;
      }

      e.preventDefault();

      updateTaskMutation.mutate({ id: task.id, description } as any, {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          navigation.dispatch(e.data.action);
        },
        onError: () => {
          navigation.dispatch(e.data.action);
        },
      });
    });
    return unsubscribe;
  }, [navigation, description, task, updateTaskMutation]);

  const handleDelete = () => {
    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      },
      onError: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      },
    });
  };

  if (isLoading || !task) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#10b981" />
      </SafeAreaView>
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
        <View className="flex-row justify-between items-center mb-8 shrink-0">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={{
              backgroundColor: isDark ? "#171717" : "#e5e5e5",
              borderColor: isDark ? "#262626" : "#d4d4d4",
            }}
            className="h-10 w-10 border rounded-full items-center justify-center active:bg-neutral-800"
          >
            <ArrowLeft size={18} color={isDark ? "#f5f5f5" : "#171717"} />
          </TouchableOpacity>

          <Text className={`text-md font-bold ${labelColorClass}`}>
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

        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className={`text-xs font-bold ${labelColorClass}`}>
              {t.projectTag}
            </Text>
            <Badge label={projectLabel} variant={projectVariant as any} />
          </View>

          {formattedCreationDate ? (
            <View className="flex-row items-center justify-between pt-1 border-t border-neutral-200/10 dark:border-neutral-800/10">
              <Text className={`text-xs font-bold ${labelColorClass}`}>
                {t.creationDate || "Created At"}
              </Text>
              <Text
                className={`text-xs font-semibold ${isDark ? "text-neutral-300" : "text-neutral-700"}`}
              >
                {formattedCreationDate}
              </Text>
            </View>
          ) : null}

          <View
            className={`flex-row justify-between items-center mt-8 pt-5 border-t ${
              isDark ? "border-neutral-900" : "border-neutral-200"
            }`}
          >
            {isConfirmingDelete ? (
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setIsConfirmingDelete(false)}
                  className={`h-10 w-10 rounded-lg items-center justify-center ${
                    isDark
                      ? "bg-neutral-800 active:bg-neutral-700"
                      : "bg-neutral-100 active:bg-neutral-200"
                  }`}
                >
                  <X size={18} color={isDark ? "#e5e5e5" : "#525252"} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDelete}
                  disabled={deleteTaskMutation.isPending}
                  className={`h-10 w-10 rounded-lg items-center justify-center ${
                    isDark
                      ? "bg-red-500/15 active:bg-red-500/25"
                      : "bg-red-50 active:bg-red-100"
                  }`}
                >
                  {deleteTaskMutation.isPending ? (
                    <ActivityIndicator size="small" color="#ef4444" />
                  ) : (
                    <Check size={18} color="#ef4444" />
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setIsConfirmingDelete(true)}
                className={`h-10 w-10 rounded-lg items-center justify-center ${
                  isDark
                    ? "bg-red-500/10 active:bg-red-500/20"
                    : "bg-red-50 active:bg-red-100"
                }`}
              >
                <Trash2 size={16} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
