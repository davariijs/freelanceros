import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export interface ActivityLog {
  id: string;
  action: string;
  metadata: string;
  createdAt: string;
}

export const useActivityLogsQuery = () => {
  return useQuery<ActivityLog[]>({
    queryKey: ["activityLogs"],
    queryFn: async () => {
      const res = await apiClient.get("/activity-logs");
      return res.data;
    },
  });
};
