"use client";

import * as React from "react";
import { Task, TaskStatus } from "@/schemas/task";
import { TaskCard } from "@/components/atoms/TaskCard";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  columnTasks: Task[];
  onTaskClick: (task: Task) => void;
  onDropTask: (taskId: string, status: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  columnTasks,
  onTaskClick,
  onDropTask,
}) => {
  const { t, activeTaskId, setActiveTaskId } = useApp();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onDropTask(taskId, id);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 min-h-125 flex flex-col gap-4 transition-colors",
        color,
      )}
    >
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {title}
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
          columnTasks.map((task) => {
            const isActive = task.id === activeTaskId;
            return (
              <div
                key={task.id}
                onClick={() => {
                  setActiveTaskId(task.id);
                  onTaskClick(task);
                }}
                className={cn(
                  "transition-all duration-200 rounded-xl",
                  isActive &&
                    "ring-3 ring-neutral-950 dark:ring-white scale-[1.03] shadow-lg focused-task-card z-10",
                )}
              >
                <TaskCard task={task} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
