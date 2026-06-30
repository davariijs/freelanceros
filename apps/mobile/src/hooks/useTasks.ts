import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { secureStore } from "@/services/secureStore";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  order: number;
  projectId?: string | null;
  createdAt: string;
}

const API_URL = "http://localhost:3001/api/tasks";

const getAuthHeaders = async () => {
  const token = await secureStore.getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const useTasksQuery = () => {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const res = await axios.get(API_URL, headers);
      return res.data;
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const headers = await getAuthHeaders();
      const res = await axios.patch(`${API_URL}/${id}`, { status }, headers);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
