import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { AuthHeader } from "@/components/layouts/AuthHeader";

export const metadata: Metadata = {
  title: "FreeOS - Sign Up",
  description: "Create a secure FreeOS workspace account.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#eaf3e7] dark:bg-[#030014]  transition-colors duration-200 relative">
      <AuthHeader />
      <RegisterForm />
    </main>
  );
}
