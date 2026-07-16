import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { syncStorage } from "@/services/syncStorage";
import NetInfo from "@react-native-community/netinfo";

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
  isOfflinePending?: boolean;
}

export const useTasksQuery = () => {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await apiClient.get("/api/tasks");
      return res.data;
    },
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      priority: TaskPriority;
      status: TaskStatus;
      projectId?: string;
    }) => {
      const netInfo = await NetInfo.fetch();
      const isOnline = !!netInfo.isConnected;

      if (!isOnline) {
        const tempId = `temp_${Date.now()}`;
        await syncStorage.addToQueue({
          id: tempId,
          action: "CREATE_TASK",
          payload: data,
        });

        const tempTask: Task = {
          id: tempId,
          ...data,
          order: 0,
          createdAt: new Date().toISOString(),
          isOfflinePending: true,
        };

        const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];
        queryClient.setQueryData(["tasks"], [...previousTasks, tempTask]);

        throw new Error("OFFLINE_SAVED");
      }

      const res = await apiClient.post("/api/tasks", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      title,
      description,
      priority,
      projectId,
    }: {
      id: string;
      status?: TaskStatus;
      title?: string;
      description?: string;
      priority?: TaskPriority;
      projectId?: string;
    }) => {
      const netInfo = await NetInfo.fetch();
      const isOnline = !!netInfo.isConnected;

      if (!isOnline) {
        await syncStorage.addToQueue({
          id,
          action: "UPDATE_TASK",
          payload: { status, title, description, priority, projectId },
        });

        const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];
        queryClient.setQueryData(
          ["tasks"],
          previousTasks.map((t) =>
            t.id === id
              ? { ...t, status: status || t.status, isOfflinePending: true }
              : t,
          ),
        );

        throw new Error("OFFLINE_SAVED");
      }

      const res = await apiClient.patch(`/api/tasks/${id}`, {
        status,
        title,
        description,
        priority,
        projectId,
      });
      console.log("PATCH RESPONSE:", res.data);
      return res.data;
    },
    onMutate: async ({
      id,
      status,
      title,
      description,
      priority,
      projectId,
    }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ["tasks"],
          previousTasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: status !== undefined ? status : t.status,
                  title: title !== undefined ? title : t.title,
                  description:
                    description !== undefined ? description : t.description,
                  priority: priority !== undefined ? priority : t.priority,
                  projectId: projectId !== undefined ? projectId : t.projectId,
                }
              : t,
          ),
        );
      }
      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
