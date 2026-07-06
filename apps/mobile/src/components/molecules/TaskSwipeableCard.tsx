import * as React from "react";
import { View, StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import * as Haptics from "expo-haptics";
import { Check, Clock } from "lucide-react-native";

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
  onComplete: (id: string) => void;
  onSnooze: (id: string) => void;
  children: React.ReactNode;
}

export const TaskSwipeableCard: React.FC<TaskSwipeableCardProps> = ({
  task,
  onComplete,
  onSnooze,
  children,
}) => {
  const swipeableRef = React.useRef<any>(null);

  const renderLeftActions = () => (
    <View
      style={styles.leftAction}
      className="bg-emerald-600 rounded-2xl justify-center px-6"
    >
      <Check size={20} color="#ffffff" />
    </View>
  );

  const renderRightActions = () => (
    <View
      style={styles.rightAction}
      className="bg-amber-600 rounded-2xl justify-center items-end px-6"
    >
      <Clock size={20} color="#ffffff" />
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

        if (direction === "left") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onComplete(task.id);
        } else if (direction === "right") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onSnooze(task.id);
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
