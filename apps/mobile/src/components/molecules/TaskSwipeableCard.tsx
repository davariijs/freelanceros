import * as React from "react";
import { View, StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import * as Haptics from "expo-haptics";
import { Check, Play, RotateCcw } from "lucide-react-native";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  order: number;
  projectId?: string | null;
  createdAt: string;
}

interface TaskSwipeableCardProps {
  task: Task;
  onUpdateStatus: (id: string, status: "TODO" | "IN_PROGRESS" | "DONE") => void;
  children: React.ReactNode;
}

export const TaskSwipeableCard: React.FC<TaskSwipeableCardProps> = ({
  task,
  onUpdateStatus,
  children,
}) => {
  const swipeableRef = React.useRef<any>(null);

  const isDone = task.status === "DONE";
  const renderLeftActions = () => (
    <View
      style={styles.leftAction}
      className={
        isDone
          ? "bg-neutral-600 rounded-2xl justify-center px-6"
          : "bg-emerald-600 rounded-2xl justify-center px-6"
      }
    >
      {isDone ? (
        <RotateCcw size={20} color="#ffffff" />
      ) : (
        <Check size={20} color="#ffffff" />
      )}
    </View>
  );

  const renderRightActions = () => (
    <View
      style={styles.rightAction}
      className="bg-blue-600 rounded-2xl justify-center items-end px-6"
    >
      <Play size={20} color="#ffffff" />
    </View>
  );

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={80}
      rightThreshold={80}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        setTimeout(() => {
          swipeableRef.current?.close();
        }, 100);

        if (direction === "right") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          if (isDone) {
            onUpdateStatus(task.id, "TODO");
          } else {
            onUpdateStatus(task.id, "DONE");
          }
        } else if (direction === "left") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onUpdateStatus(task.id, "IN_PROGRESS");
        }
      }}
    >
      {children}
    </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    marginVertical: 4,
  },
  rightAction: {
    flex: 1,
    marginVertical: 4,
  },
});
