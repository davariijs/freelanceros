"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Task, TaskStatus } from "@/schemas/task";
import { useUpdateTaskMutation } from "@/hooks/useTasks";
import { useKanbanNavigation } from "@/hooks/useKanbanNavigation";
import { KanbanColumn } from "@/components/molecules/KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskClick,
}) => {
  const { t } = useApp();
  const updateTaskMutation = useUpdateTaskMutation();
  const { getColumnTasks } = useKanbanNavigation({ tasks, onTaskClick });

  const columns: { id: TaskStatus; title: string; color: string }[] =
    React.useMemo(
      () => [
        {
          id: "TODO",
          title: t.todo,
          color: "bg-neutral-100 dark:bg-neutral-900",
        },
        {
          id: "IN_PROGRESS",
          title: t.inProgress,
          color: "bg-neutral-100/50 dark:bg-neutral-900/40",
        },
        {
          id: "DONE",
          title: t.done,
          color: "bg-neutral-100/30 dark:bg-neutral-900/20",
        },
      ],
      [t],
    );

  const handleDropTask = (taskId: string, status: TaskStatus) => {
    updateTaskMutation.mutate({ id: taskId, status });
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 h-full items-start">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          color={column.color}
          columnTasks={getColumnTasks(column.id)}
          onTaskClick={onTaskClick}
          onDropTask={handleDropTask}
        />
      ))}
    </div>
  );
};
