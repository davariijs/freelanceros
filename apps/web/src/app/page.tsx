import * as React from "react";
import { HomeView } from "@/features/landing/components/HomeView";

export default function HomePage() {
  return (
    <main className="relative min-h-screen transition-colors duration-700 dark:bg-[#030014] dark:text-neutral-50 bg-[#eaf3e7] text-[#1b241e]">
      <HomeView />
    </main>
  );
}
