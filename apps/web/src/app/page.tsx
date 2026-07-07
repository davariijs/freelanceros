"use client";

import { HeroSection } from "@/components/templates/HeroSection";

export default function HomePage() {
  return (
    <main className="relative bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300 min-h-screen">
      <HeroSection />
    </main>
  );
}
