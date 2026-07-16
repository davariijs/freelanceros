"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Sun, Moon, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FloatingActionsProps {
  osState: number;
}

export function FloatingActions({ osState }: FloatingActionsProps) {
  const { toggleLocale, setTheme, theme, locale } = useApp();
  const isDark = theme === "dark";

  const handleRedirect = () => {
    const hasToken = document.cookie
      .split("; ")
      .some((row) => row.startsWith("token="));
    window.location.href = hasToken ? "/dashboard" : "/login";
  };

  return (
    <motion.div
      animate={
        osState > 1
          ? { x: 0, opacity: 1, scale: 1 }
          : { x: 60, opacity: 0, scale: 0.9 }
      }
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="
      fixed right-0 top-1/2 -translate-y-1/2 z-50
      flex flex-col gap-2 p-1.5 rounded-l-2xl
      border-y border-l
      border-white/20 dark:border-emerald-500/30
      bg-white/10 dark:bg-[#09090e]/95
      backdrop-blur-xl shadow-2xl
      "
    >
      <Button
        onClick={handleRedirect}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-full hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30 flex items-center justify-center transition-colors cursor-pointer text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        <User className="h-3.5 w-3.5" />
      </Button>

      <div className="w-5 h-px bg-neutral-200/10 dark:bg-neutral-800/10 self-center" />

      <Button
        onClick={toggleLocale}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-full hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30 flex items-center justify-center transition-colors cursor-pointer text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-extrabold text-[9px]"
      >
        {locale === "en" ? "FA" : "EN"}
      </Button>

      <div className="w-5 h-px bg-neutral-200/10 dark:bg-neutral-800/10 self-center" />

      <Button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-full hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30 flex items-center justify-center transition-colors cursor-pointer"
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-neutral-400" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-yellow-500" />
        )}
      </Button>
    </motion.div>
  );
}
