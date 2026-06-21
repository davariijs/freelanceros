"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Button } from "@/components/atoms/Button";
import { useApp } from "@/context/AppContext";
import { LayoutDashboard, ClipboardList, Briefcase } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, dir } = useApp();

  const SidebarContent = (
    <nav className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 px-2">
          {t.workspace}
        </div>
        <div className="space-y-1">
          <Link href="/dashboard" className="block w-full">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm py-2 px-3"
            >
              <LayoutDashboard
                className={`h-4 w-4 ${dir === "rtl" ? "ml-3" : "mr-3"} text-neutral-500`}
              />
              <span>{t.dashboard}</span>
            </Button>
          </Link>
          <Link href="/dashboard/tasks" className="block w-full">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm py-2 px-3"
            >
              <ClipboardList
                className={`h-4 w-4 ${dir === "rtl" ? "ml-3" : "mr-3"} text-neutral-500`}
              />
              <span>{t.tasks}</span>
            </Button>
          </Link>
          <Link href="/dashboard/projects" className="block w-full">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm py-2 px-3"
            >
              <Briefcase
                className={`h-4 w-4 ${dir === "rtl" ? "ml-3" : "mr-3"} text-neutral-500`}
              />
              <span>{t.projects}</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );

  return <DashboardLayout sidebar={SidebarContent}>{children}</DashboardLayout>;
}
