"use client";

import * as React from "react";
import { KanbanBoard } from "@/components/organisms/KanbanBoard";
import {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/hooks/useTasks";
import { useProjectsQuery } from "@/hooks/useProjects";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/atoms/Button";
import { CreateTaskModal } from "@/components/organisms/CreateTaskModal";
import { EditTaskModal } from "@/components/organisms/EditTaskModal";
import { Select } from "@/components/atoms/Select";
import { Task, TaskPriority, TaskStatus } from "@/schemas/task";
import { Plus } from "lucide-react";

export default function TasksPage() {
  const { t } = useApp();
  const { data: tasks = [], isLoading } = useTasksQuery();
  const { data: projects = [] } = useProjectsQuery();

  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [projectFilter, setProjectFilter] = React.useState("ALL");

  const handleCreateTask = (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    projectId?: string;
  }) => {
    createTaskMutation.mutate(data);
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
    updateTaskMutation.mutate({ id, ...data });
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      if (projectFilter !== "ALL" && task.projectId !== projectFilter)
        return false;
      return true;
    });
  }, [tasks, projectFilter]);

  const projectFilterOptions = [
    { label: t.all, value: "ALL" },
    ...projects.map((p) => ({ label: p.title, value: p.id })),
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
        projects={projects}
        onSubmitTask={handleCreateTask}
      />

      <EditTaskModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        projects={projects}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}
