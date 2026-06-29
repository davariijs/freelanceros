"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: (isCollapsed: boolean) => React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar,
}) => {
  const { dir, toast } = useApp();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(drawerRef, () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  });

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200 relative">
      <div className="lg:hidden">
        <DashboardHeader onMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-neutral-950/80 backdrop-blur-sm animate-in fade-in">
          <div
            ref={drawerRef}
            className={`w-64 bg-neutral-50 dark:bg-neutral-950 h-full p-6 shadow-xl flex flex-col justify-between border-neutral-200 dark:border-neutral-800 transition-transform ${
              dir === "rtl"
                ? "mr-0 ml-auto border-l animate-in slide-in-from-right"
                : "ml-0 mr-auto border-r animate-in slide-in-from-left"
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
                FreelanceOS
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1" onClick={() => setIsMobileOpen(false)}>
              {sidebar(false)}
            </div>
          </div>
        </div>
      )}

      <aside
        className={cn(
          "bg-neutral-50 dark:bg-neutral-950 hidden lg:flex flex-col shrink-0 transition-all duration-300 relative border-neutral-200 dark:border-neutral-800",
          dir === "rtl" ? "border-l" : "border-r",
          isCollapsed
            ? "w-20 items-center px-2 py-6"
            : "w-20 xl:w-64 p-2 xl:p-6 xl:items-stretch max-xl:items-center max-xl:px-2 max-xl:py-6",
        )}
        aria-label="Main Navigation"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute top-6 h-6 w-6 p-0 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs items-center justify-center z-10 hover:bg-neutral-100 dark:hover:bg-neutral-800 hidden xl:flex",
            dir === "rtl" ? "-left-3" : "-right-3",
          )}
        >
          {isCollapsed ? (
            dir === "rtl" ? (
              <ChevronLeft className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )
          ) : dir === "rtl" ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        <div
          className={cn(
            "font-bold mb-8 text-neutral-900 dark:text-neutral-100 transition-all text-center xl:text-left",
            isCollapsed ? "text-lg" : "text-lg xl:text-xl",
          )}
        >
          <span className="xl:hidden">FOS</span>
          <span className="hidden xl:inline">
            {isCollapsed ? "FOS" : "FreelanceOS"}
          </span>
        </div>

        <div className="flex-1 w-full">{sidebar(isCollapsed)}</div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="hidden lg:block">
          <DashboardHeader />
        </div>
        <main className="grow p-6 md:p-8 container max-w-5xl mx-auto focus:outline-none relative">
          {toast && (
            <div
              className={cn(
                "fixed bottom-6 z-150 flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-900 shadow-2xl rounded-2xl border border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-bottom duration-300",
                dir === "rtl" ? "left-6" : "right-6",
              )}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
              )}
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                {toast.message}
              </span>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
};
