"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  ClipboardList,
  Briefcase,
  Users,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { CommandPalette } from "@/features/command-palette/components/CommandPalette";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, translationKey: "dashboard" },
  { href: "/dashboard/tasks", icon: ClipboardList, translationKey: "tasks" },
  { href: "/dashboard/projects", icon: Briefcase, translationKey: "projects" },
  { href: "/dashboard/clients", icon: Users, translationKey: "clients" },
  { href: "/dashboard/notes", icon: FileText, translationKey: "notes" },
] as const;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, dir, isCommandOpen, setIsCommandOpen } = useApp();

  useKeyboardShortcuts({
    onCtrlK: () => {
      setIsCommandOpen(!isCommandOpen);
    },
  });

  const SidebarContent = React.useCallback(
    (isCollapsed: boolean) => (
      <nav className="space-y-6 w-full">
        <div>
          <div
            className={cn(
              "text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 px-2",
              isCollapsed ? "hidden" : "hidden xl:block",
            )}
          >
            {t.workspace}
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const label = t[item.translationKey as keyof typeof t] as string;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative group w-full text-sm py-2 flex items-center rounded-lg transition-colors cursor-pointer",
                    "hover:bg-neutral-100 dark:hover:bg-neutral-900",
                    isCollapsed
                      ? "justify-center px-0"
                      : "justify-start lg:justify-center xl:justify-start px-3 lg:px-0 xl:px-3",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 text-neutral-500 shrink-0",
                      !isCollapsed &&
                        (dir === "rtl"
                          ? "ml-3 lg:ml-0 xl:ml-3"
                          : "mr-3 lg:mr-0 xl:mr-3"),
                    )}
                  />

                  <span
                    className={cn(
                      isCollapsed ? "hidden" : "inline lg:hidden xl:inline",
                    )}
                  >
                    {label}
                  </span>

                  <span
                    role="tooltip"
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap border bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 border-neutral-800 dark:border-neutral-200 shadow-md pointer-events-none invisible opacity-0 transition-all duration-200",
                      isCollapsed
                        ? "group-hover:visible group-hover:opacity-100"
                        : "hidden lg:group-hover:visible lg:group-hover:opacity-100 xl:group-hover:invisible xl:group-hover:opacity-0",
                      dir === "rtl"
                        ? "right-full me-2 translate-x-2 group-hover:translate-x-0"
                        : "left-full ms-2 -translate-x-2 group-hover:translate-x-0",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    ),
    [dir, t],
  );

  return (
    <DashboardLayout sidebar={SidebarContent}>
      {children}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </DashboardLayout>
  );
}
