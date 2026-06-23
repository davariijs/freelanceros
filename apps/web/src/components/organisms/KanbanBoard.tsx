"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Task, TaskStatus } from "@/schemas/task";
import { TaskCard } from "@/components/atoms/TaskCard";
import { useUpdateTaskMutation } from "@/hooks/useTasks";

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

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: "TODO", title: t.todo, color: "bg-neutral-100 dark:bg-neutral-900" },
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
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.stopPropagation();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      updateTaskMutation.mutate({ id: taskId, status });
    }
  };

  const getColumnTasks = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 h-full items-start">
      {columns.map((column) => {
        const columnTasks = getColumnTasks(column.id);

        return (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 min-h-125 flex flex-col gap-4 transition-colors ${column.color}`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {column.title}
              </h3>
              <span className="text-[10px] font-extrabold bg-neutral-200 dark:bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded-full">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="grow flex items-center justify-center p-8 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl">
                  <p className="text-xs text-neutral-400">{t.noTasks}</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div key={task.id} onClick={() => onTaskClick(task)}>
                    <TaskCard task={task} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
