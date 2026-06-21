"use client";

import * as React from "react";
import { Task } from "@/schemas/task";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

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

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm cursor-grab active:cursor-grabbing hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 select-none group",
        isDragging
          ? "opacity-50 border-dashed border-neutral-300 dark:border-neutral-800"
          : "opacity-100",
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${priorityColor[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed truncate">
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
};
