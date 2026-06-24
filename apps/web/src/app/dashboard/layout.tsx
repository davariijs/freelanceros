"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Button } from "@/components/atoms/Button";
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

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, dir } = useApp();

  const SidebarContent = (isCollapsed: boolean) => (
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
          <Link href="/dashboard" className="block w-full">
            <Button
              variant="ghost"
              className={cn(
                "relative group w-full text-sm py-2",
                isCollapsed
                  ? "justify-center px-0"
                  : "justify-center xl:justify-start px-0 xl:px-3",
              )}
            >
              <LayoutDashboard
                className={cn(
                  "h-4 w-4 text-neutral-500",
                  !isCollapsed && (dir === "rtl" ? "xl:ml-3" : "xl:mr-3"),
                )}
              />
              <span className={cn(isCollapsed ? "hidden" : "hidden xl:inline")}>
                {t.dashboard}
              </span>
              <span
                role="tooltip"
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap border bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 border-neutral-800 dark:border-neutral-200 shadow-md pointer-events-none invisible opacity-0 transition-all duration-200",
                  isCollapsed
                    ? "group-hover:visible group-hover:opacity-100"
                    : "xl:group-hover:invisible xl:group-hover:opacity-0 group-hover:visible group-hover:opacity-100",
                  dir === "rtl" ? "right-full me-2" : "left-full ms-2",
                )}
              >
                {t.dashboard}
              </span>
            </Button>
          </Link>
          <Link href="/dashboard/tasks" className="block w-full">
            <Button
              variant="ghost"
              className={cn(
                "relative group w-full text-sm py-2",
                isCollapsed
                  ? "justify-center px-0"
                  : "justify-center xl:justify-start px-0 xl:px-3",
              )}
            >
              <ClipboardList
                className={cn(
                  "h-4 w-4 text-neutral-500",
                  !isCollapsed && (dir === "rtl" ? "xl:ml-3" : "xl:mr-3"),
                )}
              />
              <span className={cn(isCollapsed ? "hidden" : "hidden xl:inline")}>
                {t.tasks}
              </span>
              <span
                role="tooltip"
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap border bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 border-neutral-800 dark:border-neutral-200 shadow-md pointer-events-none invisible opacity-0 transition-all duration-200",
                  isCollapsed
                    ? "group-hover:visible group-hover:opacity-100"
                    : "xl:group-hover:invisible xl:group-hover:opacity-0 group-hover:visible group-hover:opacity-100",
                  dir === "rtl" ? "right-full me-2" : "left-full ms-2",
                )}
              >
                {t.tasks}
              </span>
            </Button>
          </Link>
          <Link href="/dashboard/projects" className="block w-full">
            <Button
              variant="ghost"
              className={cn(
                "relative group w-full text-sm py-2",
                isCollapsed
                  ? "justify-center px-0"
                  : "justify-center xl:justify-start px-0 xl:px-3",
              )}
            >
              <Briefcase
                className={cn(
                  "h-4 w-4 text-neutral-500",
                  !isCollapsed && (dir === "rtl" ? "xl:ml-3" : "xl:mr-3"),
                )}
              />
              <span className={cn(isCollapsed ? "hidden" : "hidden xl:inline")}>
                {t.projects}
              </span>
              <span
                role="tooltip"
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap border bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 border-neutral-800 dark:border-neutral-200 shadow-md pointer-events-none invisible opacity-0 transition-all duration-200",
                  isCollapsed
                    ? "group-hover:visible group-hover:opacity-100"
                    : "xl:group-hover:invisible xl:group-hover:opacity-0 group-hover:visible group-hover:opacity-100",
                  dir === "rtl" ? "right-full me-2" : "left-full ms-2",
                )}
              >
                {t.projects}
              </span>
            </Button>
          </Link>
          <Link href="/dashboard/clients" className="block w-full">
            <Button
              variant="ghost"
              className={cn(
                "relative group w-full text-sm py-2",
                isCollapsed
                  ? "justify-center px-0"
                  : "justify-center xl:justify-start px-0 xl:px-3",
              )}
            >
              <Users
                className={cn(
                  "h-4 w-4 text-neutral-500",
                  !isCollapsed && (dir === "rtl" ? "xl:ml-3" : "xl:mr-3"),
                )}
              />
              <span className={cn(isCollapsed ? "hidden" : "hidden xl:inline")}>
                {t.clients}
              </span>
              <span
                role="tooltip"
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap border bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 border-neutral-800 dark:border-neutral-200 shadow-md pointer-events-none invisible opacity-0 transition-all duration-200",
                  isCollapsed
                    ? "group-hover:visible group-hover:opacity-100"
                    : "xl:group-hover:invisible xl:group-hover:opacity-0 group-hover:visible group-hover:opacity-100",
                  dir === "rtl" ? "right-full me-2" : "left-full ms-2",
                )}
              >
                {t.clients}
              </span>
            </Button>
          </Link>
          <Link href="/dashboard/notes" className="block w-full">
            <Button
              variant="ghost"
              className={cn(
                "relative group w-full text-sm py-2",
                isCollapsed
                  ? "justify-center px-0"
                  : "justify-center xl:justify-start px-0 xl:px-3",
              )}
            >
              <FileText
                className={cn(
                  "h-4 w-4 text-neutral-500",
                  !isCollapsed && (dir === "rtl" ? "xl:ml-3" : "xl:mr-3"),
                )}
              />
              <span className={cn(isCollapsed ? "hidden" : "hidden xl:inline")}>
                {t.notes}
              </span>
              <span
                role="tooltip"
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 z-50 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap border bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 border-neutral-800 dark:border-neutral-200 shadow-md pointer-events-none invisible opacity-0 transition-all duration-200",
                  isCollapsed
                    ? "group-hover:visible group-hover:opacity-100"
                    : "xl:group-hover:invisible xl:group-hover:opacity-0 group-hover:visible group-hover:opacity-100",
                  dir === "rtl" ? "right-full me-2" : "left-full ms-2",
                )}
              >
                {t.notes}
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );

  return <DashboardLayout sidebar={SidebarContent}>{children}</DashboardLayout>;
}
