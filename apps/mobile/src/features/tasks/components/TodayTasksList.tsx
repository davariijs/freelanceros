import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Task, TaskStatus } from "@/features/tasks/hooks/useTasks";
import { TaskSwipeableCard } from "@/features/tasks/components/TaskSwipeableCard";
import { useApp } from "@/context/AppContext";
import {
  ClipboardCheck,
  CheckCircle2,
  Circle,
  Check,
  Play,
} from "lucide-react-native";
import { cn } from "@/lib/utils";

interface TodayTasksListProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onTaskPress: (task: Task) => void;
}

export const TodayTasksList: React.FC<TodayTasksListProps> = ({
  tasks,
  onUpdateStatus,
  onTaskPress,
}) => {
  const { t, theme } = useApp();
  const isDark = theme === "dark";

  const listRef = React.useRef<any>(null);
  const prevFirstTaskId = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (tasks.length > 0) {
      const firstTaskId = tasks[0].id;
      if (prevFirstTaskId.current && prevFirstTaskId.current !== firstTaskId) {
        setTimeout(() => {
          listRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 150);
      }
      prevFirstTaskId.current = firstTaskId;
    }
  }, [tasks]);

  const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\n/g, " ");
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "LOW":
        return {
          text: "text-emerald-500",
          bgBorder: "bg-emerald-500/10 border-emerald-500/20",
        };
      case "HIGH":
        return {
          text: "text-red-500",
          bgBorder: "bg-red-500/10 border-red-500/20",
        };
      default:
        return {
          text: "text-amber-500",
          bgBorder: "bg-amber-500/10 border-amber-500/20",
        };
    }
  };

  const priorityLabels = {
    LOW: t.priorityLow || "Low",
    MEDIUM: t.priorityMedium || "Medium",
    HIGH: t.priorityHigh || "High",
  };

  const renderItem = ({ item }: { item: Task }) => {
    const isDone = item.status === "DONE";
    const isInProgress = item.status === "IN_PROGRESS";
    const priorityColor = getPriorityStyles(item.priority);

    return (
      <TaskSwipeableCard task={item} onUpdateStatus={onUpdateStatus}>
        <TouchableOpacity
          onPress={() => onTaskPress(item)}
          activeOpacity={0.8}
          className={cn(
            "p-4 border rounded-2xl my-1 flex-row items-center justify-between",
            isDone
              ? isDark
                ? "bg-neutral-800/20 border-neutral-800"
                : "bg-green-500/5 border-green-200/50"
              : isDark
                ? "bg-neutral-900 border-neutral-800"
                : "bg-white border-neutral-200",
          )}
        >
          <View className="flex-row items-center flex-1 pr-4">
            {isDone ? (
              <CheckCircle2
                size={18}
                color="#10b981"
                style={{ marginRight: 10 }}
              />
            ) : isInProgress ? (
              <CheckCircle2
                size={18}
                color="#3b82f6"
                style={{ marginRight: 10 }}
              />
            ) : (
              <Circle size={18} color="#737373" style={{ marginRight: 10 }} />
            )}

            <View className="flex-1">
              <Text
                className={cn(
                  "text-sm font-bold mb-1",
                  isDone
                    ? isDark
                      ? "text-neutral-600 line-through"
                      : "text-neutral-400 line-through"
                    : isDark
                      ? "text-neutral-100"
                      : "text-neutral-900",
                )}
              >
                {item.title}
              </Text>
              {item.description && (
                <Text
                  className={cn(
                    "text-xs",
                    isDone
                      ? "text-neutral-400/50 dark:text-neutral-600/50"
                      : "text-neutral-500 dark:text-neutral-400",
                  )}
                  numberOfLines={1}
                >
                  {stripMarkdown(item.description)}
                </Text>
              )}
            </View>
          </View>

          {isDone ? (
            <View className="px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 flex-row items-center justify-center shrink-0">
              <Check size={10} color="#10b981" style={{ marginRight: 4 }} />
              <Text className="text-[9px] font-black text-emerald-500 uppercase">
                {t.completed || "Done"}
              </Text>
            </View>
          ) : isInProgress ? (
            <View className="px-2.5 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 flex-row items-center justify-center shrink-0">
              <Play size={10} color="#3b82f6" style={{ marginRight: 4 }} />
              <Text className="text-[9px] font-black text-blue-500 uppercase">
                {t.inProgress || "Progress"}
              </Text>
            </View>
          ) : (
            <View
              className={cn(
                "px-2.5 py-1 rounded-full border shrink-0",
                isDark ? "bg-neutral-950" : "bg-neutral-50",
                priorityColor.bgBorder,
              )}
            >
              <Text
                className={cn(
                  "text-[9px] font-black uppercase",
                  priorityColor.text,
                )}
              >
                {priorityLabels[item.priority]}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </TaskSwipeableCard>
    );
  };

  return (
    <View className="flex-1 w-full">
      {tasks.length === 0 ? (
        <View className="flex-1 justify-center items-center py-20">
          <ClipboardCheck
            size={36}
            color="#737373"
            style={{ marginBottom: 12 }}
          />
          <Text className="text-xs text-neutral-500 font-semibold text-center">
            {t.noTasksToday}
          </Text>
        </View>
      ) : (
        <FlashList
          ref={listRef}
          data={tasks}
          renderItem={renderItem}
          estimatedItemSize={76}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          keyExtractor={(item: Task) => item.id}
          extraData={tasks}
        />
      )}
    </View>
  );
};
