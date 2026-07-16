"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import {
  registerSchema,
  type RegisterInput,
} from "@/features/auth/schemas/auth.schema";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { MailCheck, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const RegisterForm: React.FC = () => {
  const { t, setUser } = useApp();
  const router = useRouter();

  const [step, setStep] = React.useState<"FILL_FORM" | "VERIFY_CODE">(
    "FILL_FORM",
  );
  const [userEmail, setUserEmail] = React.useState("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [isVerifying, setIsVerifying] = React.useState(false);

  const registerRequestMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await apiClient.post("/auth/register-request", data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      setUserEmail(variables.email);
      setStep("VERIFY_CODE");
    },
  });

  const googleMutation = useMutation({
    mutationFn: async (idToken: string) => {
      const res = await apiClient.post("/auth/google", { idToken });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }
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
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (data: RegisterInput) => {
    registerRequestMutation.mutate(data);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim() || verificationCode.length !== 6) return;

    setIsVerifying(true);
    setOtpError(null);

    try {
      const response = await apiClient.post("/auth/register-verify", {
        email: userEmail,
        code: verificationCode.trim(),
      });

      const { accessToken } = response.data;
      if (accessToken) {
        document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setOtpError(
        err.response?.data?.message || "Invalid or expired verification code",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const getRegisterErrorMessage = () => {
    if (!registerRequestMutation.error) return null;
    const rawMsg =
      (registerRequestMutation.error as any).response?.data?.message ||
      registerRequestMutation.error.message ||
      "";
    if (rawMsg === "User already exists") {
      return t.errorUserExists;
    }
    return rawMsg;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="w-full max-w-sm space-y-6"
    >
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {step === "FILL_FORM" ? t.signupTitle : "Confirm your Email"}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {step === "FILL_FORM"
            ? t.signupDescription
            : `We sent a 6-digit verification code to ${userEmail}`}
        </p>
      </div>

      <div className="border border-neutral-200 dark:border-emerald-500/30 p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          {step === "FILL_FORM" ? (
            <motion.div
              key="form-step"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="space-y-4"
            >
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
                  errorMessage={
                    errors.password ? t.passwordRequired : undefined
                  }
                  {...register("password")}
                />

                {registerRequestMutation.isError && (
                  <p
                    role="alert"
                    className="text-xs text-red-500 font-bold text-center mt-2 animate-pulse"
                  >
                    {getRegisterErrorMessage()}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={registerRequestMutation.isPending}
                >
                  {registerRequestMutation.isPending
                    ? "Sending code..."
                    : t.signupButton}
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
            </motion.div>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              onSubmit={handleVerifyOtp}
              className="space-y-4"
            >
              <div className="flex flex-col items-center justify-center py-4 space-y-2">
                <div className="h-12 w-12 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-2 animate-bounce">
                  <MailCheck className="h-6 w-6 text-blue-500" />
                </div>
              </div>

              <div className="space-y-1.5 w-full">
                <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>{t.verificationCodeLabel}</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  className="w-full h-11 px-3 rounded-lg border bg-transparent text-sm text-center font-bold tracking-widest border-neutral-300 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-400/50 outline-none text-neutral-900 dark:text-neutral-100"
                  autoFocus
                />
              </div>

              {otpError && (
                <p
                  role="alert"
                  className="text-xs text-red-500 font-bold text-center mt-2"
                >
                  {otpError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isVerifying || verificationCode.length !== 6}
              >
                {isVerifying ? t.verifying : t.confirmAccountButton}
              </Button>

              <button
                type="button"
                onClick={() => setStep("FILL_FORM")}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline w-full text-center"
              >
                {t.changeRegisterInfo}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="text-center pt-4">
          <Link
            href="/login"
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
          >
            {t.loginLink}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
