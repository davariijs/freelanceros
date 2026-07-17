import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Client } from "@/features/clients/schemas/client.schema";

export const useClientsQuery = () => {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/api/clients");
        return res.data;
      } catch (error: any) {
        console.error("[useClientsQuery] Error fetching clients:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        throw error;
      }
    },
  });
};

export const useCreateClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email?: string;
      phone?: string;
      website?: string;
      socials?: { platform: string; value: string }[];
      status: string;
    }) => {
      try {
        const res = await apiClient.post("/api/clients", data);
        return res.data;
      } catch (error: any) {
        console.error("[useCreateClientMutation] Error creating client:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useUpdateClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name: string;
      email?: string;
      phone?: string;
      website?: string;
      socials?: { platform: string; value: string }[];
      status: string;
    }) => {
      try {
        const res = await apiClient.patch(`/api/clients/${id}`, data);
        return res.data;
      } catch (error: any) {
        console.error(
          `[useUpdateClientMutation] Error updating client ID ${id}:`,
          {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          },
        );
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useDeleteClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await apiClient.delete(`/api/clients/${id}`);
      } catch (error: any) {
        console.error(
          `[useDeleteClientMutation] Error deleting client ID ${id}:`,
          {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          },
        );
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
