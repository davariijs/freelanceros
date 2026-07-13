import type { Metadata } from "next";
import { LoginForm } from "@/components/organisms/LoginForm";
import { AuthHeader } from "@/components/organisms/AuthHeader";
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
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#eaf3e7] dark:bg-[#030014] transition-colors duration-200 relative">
      <AuthHeader />
      <div className="w-full max-w-sm space-y-6">
        <LoginForm />
      </div>
    </main>
  );
}
