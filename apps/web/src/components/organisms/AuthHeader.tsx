"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Globe, Sun, Moon } from "lucide-react";
import { Button } from "@/components/atoms/Button";

export const AuthHeader: React.FC = () => {
  const { toggleLocale, setTheme, theme, locale, t, dir } = useApp();

  return (
    <div
      className={`absolute top-4 ${dir === "rtl" ? "left-4" : "right-4"} flex items-center gap-1 p-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm`}
    >
      <Button
        onClick={toggleLocale}
        variant="ghost"
        size="sm"
        className="h-8 px-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center gap-2"
      >
        <Globe className="h-3.5 w-3.5 text-neutral-500" />
        <span className="text-xs font-semibold">
          {locale === "en" ? "EN" : "فا"}
        </span>
      </Button>
      <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800" />
      <Button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center"
      >
        {theme === "dark" ? (
          <Moon className="h-3.5 w-3.5 text-neutral-400" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-yellow-500" />
        )}
      </Button>
    </div>
  );
};
