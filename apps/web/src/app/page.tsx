"use client";

import * as React from "react";
import { HeroSection } from "@/components/templates/HeroSection";
import { useApp } from "@/context/AppContext";

export default function HomePage() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  return (
    <main
      className={`relative min-h-screen transition-colors duration-700 ${isDark ? "bg-[#030014] text-neutral-50" : "bg-[#eaf3e7] text-[#1b241e]"}`}
    >
      <HeroSection />
    </main>
  );
}
