"use client";

import * as React from "react";
import NetInfo from "@react-native-community/netinfo";
import { useQueryClient } from "@tanstack/react-query";
import { syncStorage, QueuedAction } from "@/services/syncStorage";
import { secureStore } from "@/services/secureStore";
import { useApp } from "@/context/AppContext";
import axios from "axios";

export function useOfflineSync() {
  const queryClient = useQueryClient();
  const { showToast, t } = useApp();

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const isOnline = !!state.isConnected;

      if (isOnline) {
        const queue: QueuedAction[] = syncStorage.getQueue();
        if (queue.length === 0) return;

        try {
          const token = await secureStore.getToken();
          const headers = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          };

          for (const item of queue) {
            if (item.action === "CREATE_TASK") {
              await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001"}/api/tasks`,
                item.payload,
                headers,
              );
            } else if (item.action === "UPDATE_TASK") {
              await axios.patch(
                `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001"}/api/tasks/${item.id}`,
                item.payload,
                headers,
              );
            }
          }

          syncStorage.clearQueue();
          queryClient.invalidateQueries({ queryKey: ["tasks"] });

          showToast(t.toastSyncSuccess, "success");
        } catch (error) {
          console.error("Offline sync pipeline failed:", error);
          showToast(t.toastSyncError, "error");
        }
      }
    });

    return () => unsubscribe();
  }, [queryClient, showToast, t]);
}
