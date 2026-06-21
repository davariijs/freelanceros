"use client";

import { useApp } from "@/context/AppContext";
import { MetricCard } from "@/components/molecules/MetricCard";
import { ActivityFeed } from "@/components/organisms/ActivityFeed";
import { ClipboardList, TrendingUp, Users, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const { t } = useApp();

  const mockActivities = [
    {
      id: "1",
      action: "TASK_CREATED",
      metadata: JSON.stringify({ title: "Deploy Express API" }),
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      action: "TASK_CREATED",
      metadata: JSON.stringify({ title: "Setup Tailwind v4" }),
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  return (
    <div className="space-y-8 py-4 md:py-8">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t.welcome}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl">
          {t.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t.todaysTasks}
          value={8}
          description="3 tasks completed"
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <MetricCard
          title={t.projectProgress}
          value="82%"
          description="+12% from last week"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <MetricCard
          title={t.monthlyRevenue}
          value="$4,250"
          description="92% of target reached"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title={t.activeClients}
          value={5}
          description="2 projects waiting review"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <ActivityFeed activities={mockActivities} />
        </div>
      </div>
    </div>
  );
}
