import type { Metadata } from "next";
import { LoginForm } from "@/components/organisms/LoginForm";
import { AuthHeader } from "@/components/organisms/AuthHeader";
import Link from "next/link";
import { cookies } from "next/headers";
import { en } from "@/locales/en";
import { fa } from "@/locales/fa";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const t = locale === "fa" ? fa : en;

  return {
    title: t.loginTitle || "FreelanceOS - Sign In",
    description:
      t.loginDescription ||
      "Secure authentication console for FreelanceOS workspace dashboard.",
  };
}

export default async function LoginPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const t = locale === "fa" ? fa : en;

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
            {t.noAccount || "Don't have an account? Sign Up"}
          </Link>
        </div>
      </div>
    </main>
  );
}
