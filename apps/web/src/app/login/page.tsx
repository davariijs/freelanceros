import type { Metadata } from "next";
import { LoginForm } from "@/components/organisms/LoginForm";

export const metadata: Metadata = {
  title: "FreelanceOS - Sign In",
  description:
    "Secure authentication console for FreelanceOS workspace dashboard.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <LoginForm />
    </main>
  );
}
