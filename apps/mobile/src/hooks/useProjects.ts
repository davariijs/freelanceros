import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { secureStore } from "@/services/secureStore";

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | null;
  clientId?: string | null;
}

const API_URL = `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001"}/api/projects`;

const getAuthHeaders = async () => {
  const token = await secureStore.getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const useProjectsQuery = () => {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const res = await axios.get(API_URL, headers);
      return res.data;
    },
  });
};
