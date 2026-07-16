"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProjectProgressChart } from "@/features/projects/components/ProjectProgressChart";
import { ActivityFeed } from "@/features/activity-logs/components/ActivityFeed";
import { useTasksQuery } from "@/features/tasks/hooks/useTasks";
import { useProjectsQuery } from "@/features/projects/hooks/useProjects";
import { useClientsQuery } from "@/features/clients/hooks/useClients";
import { useActivityLogsQuery } from "@/features/activity-logs/hooks/useActivityLogs";
import { ClipboardList, TrendingUp, Users } from "lucide-react";

export function DashboardOverview() {
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
    const pendingTasksCount = tasks.filter(
      (task) => task.status !== "DONE",
    ).length;
    const activeClientsCount = clients.filter(
      (c) => c.status === "ACTIVE",
    ).length;

    return {
      todaysTasksCount,
      completedProjectsCount,
      totalProjectsCount: projects.length,
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title={t.todaysTasks}
              value={stats.todaysTasksCount}
              description={t.descCreatedToday}
              icon={<ClipboardList className="h-5 w-5" />}
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-6 items-stretch">
            <div className="md:col-span-3 md:h-90">
              <ActivityFeed activities={activityLogs} />
            </div>
            <div className="md:col-span-3 md:h-90">
              <ProjectProgressChart
                completed={stats.completedProjectsCount}
                total={stats.totalProjectsCount}
                className="h-full"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
