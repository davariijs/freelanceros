import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Task } from "@/hooks/useTasks";
import { TaskSwipeableCard } from "@/components/molecules/TaskSwipeableCard";
import { useApp } from "@/context/AppContext";
import { ClipboardCheck, CheckCircle2, Circle } from "lucide-react-native";

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

  const renderItem = ({ item }: { item: Task }) => {
    const isDone = item.status === "DONE";

    return (
      <TaskSwipeableCard
        task={item}
        onComplete={onComplete}
        onSnooze={onSnooze}
      >
        <TouchableOpacity
          onPress={() => onTaskPress(item)}
          style={{ opacity: isDone ? 0.4 : 1 }}
          className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl my-1 flex-row items-center justify-between active:bg-neutral-800/80"
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
                className="text-sm font-bold text-neutral-100 mb-1"
              >
                {item.title}
              </Text>
              {item.description && (
                <Text className="text-xs text-neutral-500" numberOfLines={1}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>
          <View className="px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-950">
            <Text className="text-[9px] font-black text-amber-500 uppercase">
              {item.priority}
            </Text>
          </View>
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
        />
      )}
    </View>
  );
};
