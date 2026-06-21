"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Menu, Globe, Sun, Moon } from "lucide-react";
import { Button } from "@/components/atoms/Button";

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuToggle,
}) => {
  const { toggleLocale, setTheme, theme, locale, t } = useApp();

  const activeLanguageLabel = locale === "en" ? "EN" : "فا";

  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 px-6 md:px-8 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="flex items-center gap-4">
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="md:hidden h-9 w-9 p-0"
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="font-semibold text-neutral-500 dark:text-neutral-400 text-sm hidden md:block">
          {t.workspaceConsole}
        </div>
      </div>
      <div className="flex items-center gap-1 p-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 backdrop-blur-sm">
        <Button
          onClick={toggleLocale}
          variant="ghost"
          size="sm"
          className="h-8 px-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center gap-2"
          aria-label="Toggle Language"
        >
          <Globe className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
          <span className="text-xs font-semibold">{activeLanguageLabel}</span>
        </Button>
        <div className="w-[1px] h-4 bg-neutral-200 dark:bg-neutral-800" />
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Moon className="h-3.5 w-3.5 text-neutral-400" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-yellow-500" />
          )}
        </Button>
      </div>
    </header>
  );
};
