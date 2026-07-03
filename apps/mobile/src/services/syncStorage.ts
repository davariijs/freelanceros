import AsyncStorage from "@react-native-async-storage/async-storage";

export interface QueuedAction {
  id: string;
  action: "CREATE_TASK" | "UPDATE_TASK";
  payload: any;
  createdAt: string;
}

const SYNC_QUEUE_KEY = "freelanceos_offline_sync_queue";

export const syncStorage = {
  async getQueue(): Promise<QueuedAction[]> {
    try {
      const raw = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async addToQueue(action: Omit<QueuedAction, "createdAt">): Promise<void> {
    try {
      const queue = await this.getQueue();
      const newAction: QueuedAction = {
        ...action,
        createdAt: new Date().toISOString(),
      };
      queue.push(newAction);
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error("Failed to write to offline queue:", e);
    }
  },

  async clearQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
    } catch (e) {
      console.error("Failed to clear offline queue:", e);
    }
  },
};
