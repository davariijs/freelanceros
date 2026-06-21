"use client";

import { KanbanBoard } from "@/components/organisms/KanbanBoard";
import { useTasksQuery } from "@/hooks/useTasks";
import { useApp } from "@/context/AppContext";

export default function TasksPage() {
  const { t } = useApp();
  const { data: tasks = [], isLoading } = useTasksQuery();

  const mockTasks = [
    {
      id: "t1",
      title: "Initialize Next.js v16 Client",
      status: "DONE",
      priority: "HIGH",
      order: 1,
    },
    {
      id: "t2",
      title: "Setup Tailwind CSS v4 Styles",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      order: 2,
    },
    {
      id: "t3",
      title: "Write Playwright E2E Integration Specs",
      status: "TODO",
      priority: "LOW",
      order: 3,
    },
  ];

  const currentTasks = tasks.length > 0 ? tasks : (mockTasks as any);

  return (
    <div className="space-y-6 py-4 md:py-8">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t.kanbanTitle}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
          {t.kanbanDescription}
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-neutral-400">{t.loadingKanban}</p>
        </div>
      ) : (
        <KanbanBoard tasks={currentTasks} />
      )}
    </div>
  );
}
