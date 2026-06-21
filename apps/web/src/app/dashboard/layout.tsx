"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Button } from "@/components/atoms/Button";
import { useApp } from "@/context/AppContext";
import { LayoutDashboard } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, dir } = useApp();

  const SidebarContent = (
    <nav className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 px-2">
          {t.workspace}
        </div>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm py-2 px-3"
          >
            <LayoutDashboard
              className={`h-4 w-4 ${dir === "rtl" ? "ml-3" : "mr-3"} text-neutral-500 dark:text-neutral-400`}
            />
            <span>{t.tasks}</span>
          </Button>
        </div>
      </div>
    </nav>
  );

  return <DashboardLayout sidebar={SidebarContent}>{children}</DashboardLayout>;
}
