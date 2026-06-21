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

export const RegisterForm: React.FC = () => {
  const { t } = useApp();
  const router = useRouter();
  const registerMutation = useRegisterMutation();

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
