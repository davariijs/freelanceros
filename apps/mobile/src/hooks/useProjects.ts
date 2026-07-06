import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | null;
  clientId?: string | null;
}

export const useProjectsQuery = () => {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await apiClient.get("/api/projects");
      return res.data;
    },
  });
};
