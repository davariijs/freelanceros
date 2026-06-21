import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Task, TaskStatus } from "@/schemas/task";

export const useTasksQuery = () => {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await apiClient.get("/tasks");
      return res.data;
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      if (id.startsWith("t")) {
        return { id, status };
      }
      const res = await apiClient.patch(`/tasks/${id}`, { status });
      return res.data;
    },

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ["tasks"],
          previousTasks.map((t) => (t.id === id ? { ...t, status } : t)),
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
