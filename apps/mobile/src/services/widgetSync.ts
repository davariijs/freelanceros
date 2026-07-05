import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "@/hooks/useTasks";

export const widgetSync = {
  async syncTodayTasks(tasks: Task[]): Promise<void> {
    try {
      const todayTasks = tasks
        .filter((t) => t.status !== "DONE")
        .slice(0, 3)
        .map((t) => ({
          id: t.id,
          title: t.title,
          priority: t.priority,
        }));

      const rawJson = JSON.stringify(todayTasks);

      await AsyncStorage.setItem("today_tasks_json", rawJson);

      console.log("Widget storage synchronized successfully.");
    } catch (error) {
      console.error("Widget storage synchronization failed:", error);
    }
  },
};
