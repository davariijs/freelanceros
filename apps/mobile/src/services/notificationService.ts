import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  async registerForPushNotificationsAsync(): Promise<string | null> {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    try {
      const tokenData = await Notifications.getDevicePushTokenAsync();
      return tokenData.data;
    } catch (error) {
      return null;
    }
  },

  async scheduleDailyReminder(title: string, body: string): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 21,
          minute: 0,
        },
      });
    } catch (error) {
      console.error("Failed to schedule daily reminder:", error);
    }
  },

  async scheduleProjectDeadlineNotifications(
    projects: any[],
    t: any,
  ): Promise<void> {
    try {
      const storedNotifiedRaw = await AsyncStorage.getItem(
        "notified_project_deadlines",
      );
      const notifiedIds: string[] = storedNotifiedRaw
        ? JSON.parse(storedNotifiedRaw)
        : [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const newNotifiedIds = [...notifiedIds];

      for (const proj of projects) {
        if (!proj.dueDate) continue;

        const dueDate = new Date(proj.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        const todayKey = `${proj.id}_today`;
        const tomorrowKey = `${proj.id}_tomorrow`;

        if (
          dueDate.getTime() === today.getTime() &&
          !notifiedIds.includes(todayKey)
        ) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title:
                t.activityProjectDeadlineToday?.replace(
                  "{title}",
                  proj.title,
                ) || `Deadline Today: ${proj.title}`,
              body:
                t.notificationDeadlineTodayBody ||
                "Today is the final day to complete this project contract!",
              sound: true,
              data: { type: "PROJECT_DEADLINE", projectId: proj.id },
            },
            trigger: null,
          });
          newNotifiedIds.push(todayKey);
        } else if (
          dueDate.getTime() === tomorrow.getTime() &&
          !notifiedIds.includes(tomorrowKey)
        ) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title:
                t.activityProjectDeadlineTomorrow?.replace(
                  "{title}",
                  proj.title,
                ) || `Deadline Tomorrow: ${proj.title}`,
              body:
                t.notificationDeadlineTomorrowBody ||
                "Tomorrow is the contract deadline. Wrap up remaining tasks!",
              sound: true,
              data: { type: "PROJECT_DEADLINE", projectId: proj.id },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour: 9,
              minute: 0,
            },
          });
          newNotifiedIds.push(tomorrowKey);
        }
      }

      await AsyncStorage.setItem(
        "notified_project_deadlines",
        JSON.stringify(newNotifiedIds),
      );
    } catch (error) {
      console.error("Failed to sync project deadlines:", error);
    }
  },
};
