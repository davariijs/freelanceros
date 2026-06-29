"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { useLoginMutation } from "@/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { useRouter } from "next/navigation";

export const LoginForm: React.FC = () => {
  const { t } = useApp();
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t.loginTitle}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t.loginDescription}
        </p>
      </div>
      <div className="border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {loginMutation.isError && (
            <p role="alert" className="text-xs text-red-500 font-medium">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : "Login failed"}
            </p>
          )}

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? t.loading : t.loginButton}
          </Button>
        </form>
      </div>
    </div>
  );
};
