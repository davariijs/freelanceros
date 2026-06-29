"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Globe, Sun, Moon, Search, Menu } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuToggle,
}) => {
  const { toggleLocale, setTheme, theme, locale, t, dir, setIsCommandOpen } =
    useApp();
  const activeLanguageLabel = locale === "en" ? "English" : "فارسی";

  const [osSymbol, setOsSymbol] = React.useState("Ctrl");
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isMac = navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
      setOsSymbol(isMac ? "⌘" : "Ctrl");
    }
  }, []);

  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 px-6 md:px-8 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="flex items-center gap-4 grow">
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden h-9 w-9 p-0"
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCommandOpen(true);
          }}
          className={cn(
            "hidden md:flex items-center gap-3 px-3 py-1.5 text-xs text-neutral-400 dark:text-neutral-500 border border-neutral-300 dark:border-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer w-64",
            dir === "rtl" ? "text-right" : "text-left",
          )}
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="grow truncate">{t.searchPlaceholderHeader}</span>
          <kbd className="font-mono text-[9px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 shrink-0 font-bold shadow-xs">
            {osSymbol} K
          </kbd>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCommandOpen(true);
          }}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 bg-white dark:bg-neutral-900 shadow-xs active:scale-90 transition-transform duration-150 relative group"
          aria-label="Search Console"
        >
          <Search className="h-4 w-4" />
          <span className="absolute inset-0 rounded-xl bg-neutral-400/10 animate-ping pointer-events-none group-hover:block hidden" />
        </button>
      </div>

      <div className="flex items-center gap-1 p-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 backdrop-blur-sm shrink-0">
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
        <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800" />
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
