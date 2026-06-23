"use client";

import * as React from "react";
import { Task } from "@/schemas/task";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { dir } = useApp();
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      setIsDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const priorityColor = {
    LOW: "bg-green-500/10 text-green-500 border-green-500/20",
    MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    HIGH: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const truncatedTitle =
    task.title.length > 30 ? `${task.title.substring(0, 30)}...` : task.title;
  const isDone = task.status === "DONE";

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "p-4 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200 select-none group",
        isDone
          ? "bg-green-50/50 dark:bg-green-950/20 border-green-200/50 dark:border-green-900/50 hover:border-green-300 dark:hover:border-green-800"
          : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700",
        isDragging ? "opacity-50 border-dashed" : "opacity-100",
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${priorityColor[task.priority]}`}
          >
            {task.priority}
          </span>
          <Pencil className="h-3 w-3 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors duration-200" />
        </div>
        <h4
          className={cn(
            "text-sm font-semibold transition-colors truncate",
            isDone
              ? "text-green-900 dark:text-green-100"
              : "text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-white",
          )}
        >
          {truncatedTitle}
        </h4>
        {task.description && (
          <p
            className={cn(
              "text-xs leading-relaxed truncate",
              isDone
                ? "text-green-700/70 dark:text-green-400/70"
                : "text-neutral-400 dark:text-neutral-500",
            )}
          >
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
};
