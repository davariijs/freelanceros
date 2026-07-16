import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { LoginInput, RegisterInput } from "@/features/auth/schemas/auth.schema";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await apiClient.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
      }
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await apiClient.post("/auth/register", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
      }
    },
  });
};
