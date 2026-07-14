import type { Metadata } from "next";
import { AuthHeader } from "@/components/organisms/AuthHeader";
import { ForgotPasswordForm } from "@/components/organisms/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "FreeOS - Forgot Password",
  description: "Reset your administrative console credentials securely.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#eaf3e7] dark:bg-[#030014]  transition-colors duration-200 relative">
      <AuthHeader />
      <ForgotPasswordForm />
    </main>
  );
}
