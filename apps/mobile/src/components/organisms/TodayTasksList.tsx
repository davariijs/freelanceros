import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Task } from "@/hooks/useTasks";
import { TaskSwipeableCard } from "@/components/molecules/TaskSwipeableCard";
import { useApp } from "@/context/AppContext";
import {
  ClipboardCheck,
  CheckCircle2,
  Circle,
  Check,
} from "lucide-react-native";
import { cn } from "@/lib/utils";

interface TodayTasksListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onSnooze: (id: string) => void;
  onTaskPress: (task: Task) => void;
}

export const TodayTasksList: React.FC<TodayTasksListProps> = ({
  tasks,
  onComplete,
  onSnooze,
  onTaskPress,
}) => {
  const { t } = useApp();

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
    const priorityColor = getPriorityStyles(item.priority);

    return (
      <TaskSwipeableCard
        task={item}
        onComplete={onComplete}
        onSnooze={onSnooze}
      >
        <TouchableOpacity
          onPress={() => onTaskPress(item)}
          className={cn(
            "p-4 border rounded-2xl my-1 flex-row items-center justify-between active:bg-neutral-800",
            isDone
              ? "bg-neutral-800/40 border-neutral-800"
              : "bg-neutral-900 border-neutral-800",
          )}
        >
          <View className="flex-row items-center flex-1 pr-4">
            {isDone ? (
              <CheckCircle2
                size={18}
                color="#10b981"
                style={{ marginRight: 10 }}
              />
            ) : (
              <Circle size={18} color="#525252" style={{ marginRight: 10 }} />
            )}

            <View className="flex-1">
              <Text
                style={{ textDecorationLine: isDone ? "line-through" : "none" }}
                className={cn(
                  "text-sm font-bold mb-1",
                  isDone ? "text-neutral-400" : "text-neutral-100",
                )}
              >
                {item.title}
              </Text>
              {item.description && (
                <Text
                  className={cn(
                    "text-xs",
                    isDone ? "text-neutral-600" : "text-neutral-500",
                  )}
                  numberOfLines={1}
                >
                  {item.description}
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
          ) : (
            <View
              className={cn(
                "px-2.5 py-1 rounded-full border bg-neutral-950 shrink-0",
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
            color="#525252"
            style={{ marginBottom: 12 }}
          />
          <Text className="text-xs text-neutral-500 font-semibold text-center">
            {t.noTasksToday}
          </Text>
        </View>
      ) : (
        <FlashList
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
