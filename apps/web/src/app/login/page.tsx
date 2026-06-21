import type { Metadata } from "next";
import { LoginForm } from "@/components/organisms/LoginForm";
import { AuthHeader } from "@/components/organisms/AuthHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FreelanceOS - Sign In",
  description:
    "Secure authentication console for FreelanceOS workspace dashboard.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200 relative">
      <AuthHeader />
      <div className="w-full max-w-sm space-y-6">
        <LoginForm />
        <div className="text-center">
          <Link
            href="/register"
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
