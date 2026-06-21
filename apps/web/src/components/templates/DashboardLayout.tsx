"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar,
}) => {
  const { dir } = useApp();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <div className="md:hidden">
        <DashboardHeader onMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-neutral-950/80 backdrop-blur-sm">
          <div
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
              {sidebar}
            </div>
          </div>
        </div>
      )}

      <aside
        className={`w-64 bg-neutral-50 dark:bg-neutral-950 p-6 hidden md:block shrink-0 ${
          dir === "rtl"
            ? "border-l border-neutral-200 dark:border-neutral-800"
            : "border-r border-neutral-200 dark:border-neutral-800"
        }`}
        aria-label="Main Navigation"
      >
        <div className="font-bold text-xl mb-8 text-neutral-900 dark:text-neutral-100">
          FreelanceOS
        </div>
        {sidebar}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="hidden md:block">
          <DashboardHeader />
        </div>
        <main className="grow p-6 md:p-8 container max-w-5xl mx-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};
