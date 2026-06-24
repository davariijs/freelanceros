"use client";

import * as React from "react";
import { KanbanBoard } from "@/components/organisms/KanbanBoard";
import { useTasksQuery } from "@/hooks/useTasks";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/atoms/Button";
import { CreateTaskModal } from "@/components/organisms/CreateTaskModal";
import { EditTaskModal } from "@/components/organisms/EditTaskModal";
import { Select } from "@/components/atoms/Select";
import { Task, TaskPriority, TaskStatus } from "@/schemas/task";
import { Plus } from "lucide-react";

export default function TasksPage() {
  const { t } = useApp();
  const { data: tasks, isLoading } = useTasksQuery();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [localTasks, setLocalTasks] = React.useState<Task[]>([]);
  const [projectFilter, setProjectFilter] = React.useState("ALL");

  const mockProjects = [
    { id: "p1", title: "Enterprise Core E-Commerce" },
    { id: "p2", title: "Mobile Wallet Expo App" },
  ];

  React.useEffect(() => {
    if (isLoading) return;
    const mockTasks: Task[] = [
      {
        id: "t1",
        title: "Initialize Next.js v16 Client",
        status: "DONE",
        priority: "HIGH",
        order: 1,
        projectId: "p1",
      },
      {
        id: "t2",
        title: "Setup Tailwind CSS v4 Styles",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        order: 2,
        projectId: "p2",
      },
      {
        id: "t3",
        title: "Write Playwright E2E Integration Specs",
        status: "TODO",
        priority: "LOW",
        order: 3,
      },
    ];

    const resolvedTasks = tasks && tasks.length > 0 ? tasks : mockTasks;
    setLocalTasks(resolvedTasks);
  }, [tasks, isLoading]);

  const handleCreateTask = (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    projectId?: string;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      order: localTasks.length + 1,
      projectId: data.projectId,
    };
    setLocalTasks([newTask, ...localTasks]);
  };

  const handleUpdateTask = (
    id: string,
    data: {
      title: string;
      description: string;
      priority: TaskPriority;
      projectId?: string;
    },
  ) => {
    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...data,
              projectId: data.projectId === "NONE" ? undefined : data.projectId,
            }
          : t,
      ),
    );
  };

  const handleDeleteTask = (id: string) => {
    setLocalTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = React.useMemo(() => {
    return localTasks.filter((task) => {
      if (projectFilter !== "ALL" && task.projectId !== projectFilter)
        return false;
      return true;
    });
  }, [localTasks, projectFilter]);

  const projectFilterOptions = [
    { label: t.all, value: "ALL" },
    ...mockProjects.map((p) => ({ label: p.title, value: p.id })),
  ];

  return (
    <div className="space-y-6 py-4 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {t.kanbanBoard}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
            {t.kanbanDescription}
          </p>
        </div>
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <Select
            value={projectFilter}
            options={projectFilterOptions}
            onChange={setProjectFilter}
            className="w-48"
          />
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            {t.createTask}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-neutral-400">{t.loadingKanban}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <KanbanBoard
            tasks={filteredTasks}
            onTaskClick={(task) => setSelectedTask(task)}
          />
        </div>
      )}

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitTask={handleCreateTask}
      />

      <EditTaskModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}
