import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { LoginInput } from "@/schemas/auth";

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
