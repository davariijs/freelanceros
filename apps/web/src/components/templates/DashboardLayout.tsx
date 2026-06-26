"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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
  const { dir } = useApp();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(drawerRef, () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  });

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="lg:hidden">
        <DashboardHeader onMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-neutral-950/80 backdrop-blur-sm">
          <div
            ref={drawerRef}
            className={`w-64 bg-neutral-50 dark:bg-neutral-950 h-full p-6 shadow-xl flex flex-col justify-between border-neutral-200 dark:border-neutral-800 ${
              dir === "rtl" ? "mr-0 ml-auto border-l" : "ml-0 mr-auto border-r"
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="font-bold text-lg">FreelanceOS</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
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
            "absolute top-6 h-6 w-6 p-0 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm items-center justify-center z-10 hover:bg-neutral-100 dark:hover:bg-neutral-800 hidden xl:flex",
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
        <main className="grow p-6 md:p-8 container max-w-5xl mx-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};
