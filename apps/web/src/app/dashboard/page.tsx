"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { MetricCard } from "@/components/molecules/MetricCard";
import { ActivityFeed } from "@/components/organisms/ActivityFeed";
import { useTasksQuery } from "@/hooks/useTasks";
import { useProjectsQuery } from "@/hooks/useProjects";
import { useClientsQuery } from "@/hooks/useClients";
import { useActivityLogsQuery } from "@/hooks/useActivityLogs";
import { ClipboardList, TrendingUp, Users, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const { t } = useApp();

  const { data: tasks = [], isLoading: isTasksLoading } = useTasksQuery();
  const { data: projects = [], isLoading: isProjectsLoading } =
    useProjectsQuery();
  const { data: clients = [], isLoading: isClientsLoading } = useClientsQuery();
  const { data: activityLogs = [], isLoading: isLogsLoading } =
    useActivityLogsQuery();

  const isDataLoading =
    isTasksLoading || isProjectsLoading || isClientsLoading || isLogsLoading;

  const stats = React.useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todaysTasksCount = tasks.filter((task) =>
      task.createdAt.startsWith(todayStr),
    ).length;

    const completedProjectsCount = projects.filter(
      (p) => p.status === "COMPLETED",
    ).length;
    const projectProgressPercent =
      projects.length > 0
        ? Math.round((completedProjectsCount / projects.length) * 100)
        : 0;

    const pendingTasksCount = tasks.filter(
      (task) => task.status !== "DONE",
    ).length;

    const activeClientsCount = clients.filter(
      (c) => c.status === "ACTIVE",
    ).length;

    return {
      todaysTasksCount,
      projectProgressPercent: `${projectProgressPercent}%`,
      pendingTasksCount,
      activeClientsCount,
    };
  }, [tasks, projects, clients]);

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

      {isDataLoading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-neutral-400">{t.mainloading}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title={t.todaysTasks}
              value={stats.todaysTasksCount}
              description={t.descCreatedToday}
              icon={<ClipboardList className="h-5 w-5" />}
            />
            <MetricCard
              title={t.projectProgress}
              value={stats.projectProgressPercent}
              description={t.descCompletedVsTotal}
              icon={<CheckCircle className="h-5 w-5" />}
            />
            <MetricCard
              title={t.pendingTasks || "Pending Tasks"}
              value={stats.pendingTasksCount}
              description={t.descActiveInKanban}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <MetricCard
              title={t.activeClients}
              value={stats.activeClientsCount}
              description={t.descActiveClients}
              icon={<Users className="h-5 w-5" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-3">
              <ActivityFeed activities={activityLogs} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
