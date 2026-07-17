import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Client } from "@/features/clients/schemas/client.schema";

export const useClientsQuery = () => {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        console.log("[useClientsQuery] Initiating fetch for clients...");
        const res = await apiClient.get("/api/clients");
        console.log(
          "[useClientsQuery] Fetch success, clients count:",
          res.data?.length,
        );
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
        console.log(
          "[useCreateClientMutation] Submitting new client payload:",
          JSON.stringify(data),
        );
        const res = await apiClient.post("/api/clients", data);
        console.log(
          "[useCreateClientMutation] Client created successfully:",
          JSON.stringify(res.data),
        );
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
        console.log(
          `[useUpdateClientMutation] Updating client ID ${id} with payload:`,
          JSON.stringify(data),
        );
        const res = await apiClient.patch(`/api/clients/${id}`, data);
        console.log(
          `[useUpdateClientMutation] Client ID ${id} updated successfully:`,
          JSON.stringify(res.data),
        );
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
        console.log(
          `[useDeleteClientMutation] Initiating deletion of client ID: ${id}`,
        );
        await apiClient.delete(`/api/clients/${id}`);
        console.log(
          `[useDeleteClientMutation] Client ID: ${id} deleted successfully from database`,
        );
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
