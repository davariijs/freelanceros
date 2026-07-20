"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Lock, Mail, KeyRound, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export const ForgotPasswordForm: React.FC = () => {
  const { t } = useApp();
  const [step, setStep] = React.useState<"REQUEST" | "RESET" | "SUCCESS">(
    "REQUEST",
  );
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const requestMutation = useMutation({
    mutationFn: async (targetEmail: string) => {
      const res = await apiClient.post("/auth/reset-request", {
        email: targetEmail,
      });
      return res.data;
    },
    onSuccess: () => {
      setStep("RESET");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      const rawMsg = err.response?.data?.message || err.message || "";
      if (rawMsg === "No user registered with this email") {
        setErrorMsg(t.errorInvalidCredentials);
      } else {
        setErrorMsg(rawMsg);
      }
    },
  });

  const verifyMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (data: any) => {
      const res = await apiClient.post("/auth/reset-verify", data);
      return res.data;
    },
    onSuccess: () => {
      setStep("SUCCESS");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || "Reset failed");
    },
  });

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setErrorMsg(null);
    requestMutation.mutate(email.trim());
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.length !== 6 || !newPassword.trim()) return;
    setErrorMsg(null);
    verifyMutation.mutate({
      email: email.trim(),
      code: code.trim(),
      newPassword: newPassword.trim(),
    });
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2 animate-in fade-in">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {step === "REQUEST"
            ? t.forgotPasswordTitle
            : step === "RESET"
              ? t.verifyCodeTitle
              : t.passwordRestoredTitle}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {step === "REQUEST"
            ? t.forgotPasswordDesc
            : step === "RESET"
              ? t.verifyCodeDesc.replace("{email}", email)
              : t.passwordRestoredDesc}
        </p>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm transition-all duration-300">
        {step === "REQUEST" && (
          <form
            onSubmit={handleRequestSubmit}
            className="space-y-4 animate-in slide-in-from-top-2 duration-300"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <span>{t.email}</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-3 rounded-lg border bg-transparent text-sm border-neutral-300 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-400/50 outline-none text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-bold text-center">
                {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={requestMutation.isPending}
            >
              {requestMutation.isPending ? "Sending..." : t.sendCodeButton}
            </Button>
          </form>
        )}

        {step === "RESET" && (
          <form
            onSubmit={handleVerifySubmit}
            className="space-y-4 animate-in zoom-in-95 duration-300"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5" />
                <span>{t.securityCode}</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full h-11 px-3 rounded-lg border bg-transparent text-sm text-center font-bold tracking-widest border-neutral-300 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-400/50 outline-none text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                <span>{t.newPasswordLabel}</span>
              </label>

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-3 pr-10 rounded-lg border bg-transparent text-sm border-neutral-300 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-400/50 outline-none text-neutral-900 dark:text-neutral-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-neutral-400" />
                  )}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-bold text-center">
                {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={
                verifyMutation.isPending ||
                code.length !== 6 ||
                newPassword.length < 6
              }
            >
              {verifyMutation.isPending ? "Updating..." : t.forgotPasswordTitle}
            </Button>
          </form>
        )}

        {step === "SUCCESS" && (
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t.passwordUpdatedSuccess}
            </p>
            <Link href="/login" className="block">
              <Button className="w-full">{t.signInNow}</Button>
            </Link>
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/login"
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
          >
            {t.returnToSignIn}
          </Link>
        </div>
      </div>
    </div>
  );
};
