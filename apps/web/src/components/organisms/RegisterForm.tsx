"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { useRegisterMutation } from "@/hooks/useAuth";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export const RegisterForm: React.FC = () => {
  const { t } = useApp();
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const googleMutation = useMutation({
    mutationFn: async (idToken: string) => {
      const res = await apiClient.post("/auth/google", { idToken });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
        router.push("/dashboard");
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t.signupTitle}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t.signupDescription}
        </p>
      </div>
      <div className="border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label={t.fullName}
            type="text"
            placeholder="John Doe"
            errorMessage={errors.name ? t.fullNameRequired : undefined}
            {...register("name")}
          />
          <FormField
            label={t.email}
            type="email"
            placeholder="you@example.com"
            errorMessage={errors.email ? t.emailRequired : undefined}
            {...register("email")}
          />
          <FormField
            label={t.password}
            type="password"
            placeholder="••••••••"
            errorMessage={errors.password ? t.passwordRequired : undefined}
            {...register("password")}
          />

          {registerMutation.isError && (
            <p role="alert" className="text-xs text-red-500 font-medium">
              {registerMutation.error instanceof Error
                ? registerMutation.error.message
                : "Registration failed"}
            </p>
          )}

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? t.signingUp : t.signupButton}
          </Button>
        </form>

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute w-full border-t border-neutral-200 dark:border-neutral-800" />
          <span className="relative bg-white dark:bg-neutral-900 px-3 text-xs text-neutral-400">
            {t.or}
          </span>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                googleMutation.mutate(credentialResponse.credential);
              }
            }}
            onError={() => {
              console.error("Google Sign-In failed");
            }}
            shape="pill"
            width={200}
            text="signup_with"
          />
        </div>

        <div className="text-center pt-4">
          <Link
            href="/login"
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
          >
            {t.loginLink}
          </Link>
        </div>
      </div>
    </div>
  );
};
