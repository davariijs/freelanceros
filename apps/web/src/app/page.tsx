import type { Metadata } from "next";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FreelanceOS - Landing Page",
  description: "A keyboard-first freelance operations system.",
};

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <section className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          FreelanceOS
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed">
          The unified workspace for modern freelancers. Organize clients,
          schedule timeline projects, and automate tasks.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/login">
            <Button>Access Dashboard</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
