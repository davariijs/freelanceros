import { MMKV } from "react-native-mmkv";

export const mmkvStorage = new MMKV();

export interface QueuedAction {
  id: string;
  action: "CREATE_TASK" | "UPDATE_TASK";
  payload: any;
  createdAt: string;
}

const SYNC_QUEUE_KEY = "freelanceos_offline_sync_queue";

export const syncStorage = {
  getQueue(): QueuedAction[] {
    try {
      const raw = mmkvStorage.getString(SYNC_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addToQueue(action: Omit<QueuedAction, "createdAt">): void {
    const queue = this.getQueue();
    const newAction: QueuedAction = {
      ...action,
      createdAt: new Date().toISOString(),
    };
    queue.push(newAction);
    mmkvStorage.set(SYNC_QUEUE_KEY, JSON.stringify(queue));
  },

  clearQueue(): void {
    mmkvStorage.delete(SYNC_QUEUE_KEY);
  },
};
