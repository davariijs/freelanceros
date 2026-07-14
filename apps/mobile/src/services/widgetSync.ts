import DefaultPreference from "react-native-default-preference";
import { Task } from "@/hooks/useTasks";
import { Platform, NativeModules } from "react-native";

const APP_GROUP_IDENTIFIER = "group.com.freeos.mobile";

export const widgetSync = {
  async syncTodayTasks(tasks: Task[]): Promise<void> {
    try {
      const todayTasks = [...tasks]
        .filter((t) => t.status !== "DONE")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3)
        .map((t) => ({
          id: t.id,
          title: t.title,
          priority: t.priority,
        }));

      const rawJson = JSON.stringify(todayTasks);

      if (Platform.OS === "android" || Platform.OS === "ios") {
        await DefaultPreference.setName(APP_GROUP_IDENTIFIER);
        await DefaultPreference.set("today_tasks_json", rawJson);
        if (Platform.OS === "android" && NativeModules.WidgetUpdateModule) {
          NativeModules.WidgetUpdateModule.updateWidget();
        }

        console.log("Widget storage synchronized successfully with system.");
      }
    } catch (error) {
      console.error("Widget storage synchronization failed:", error);
    }
  },
};
