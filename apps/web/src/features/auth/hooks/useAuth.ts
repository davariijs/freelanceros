import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { LoginInput, RegisterInput } from "@/features/auth/schemas/auth.schema";
import { useApp } from "@/context/AppContext";

export const useLoginMutation = () => {
  const { setUser } = useApp();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await apiClient.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
    },
  });
};

export const useRegisterMutation = () => {
  const { setUser } = useApp();
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await apiClient.post("/auth/register", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
    },
  });
};
