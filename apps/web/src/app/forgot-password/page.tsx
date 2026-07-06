import type { Metadata } from "next";
import { AuthHeader } from "@/components/organisms/AuthHeader";
import { ForgotPasswordForm } from "@/components/organisms/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "FreelanceOS - Forgot Password",
  description: "Reset your administrative console credentials securely.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200 relative">
      <AuthHeader />
      <ForgotPasswordForm />
    </main>
  );
}
