"use client";

import * as React from "react";
import { Task } from "@/features/tasks/schemas/task.schema";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/^#\s+(.*$)/gim, "$1")
      .replace(/\n/g, " ");
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
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "p-4 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200 select-none group touch-none",
        isDone
          ? "bg-green-50/50 dark:bg-green-950/20 border-green-200/50 dark:border-green-900/50 hover:border-green-300 dark:hover:border-green-800"
          : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700",
        isDragging
          ? "opacity-30 border-dashed bg-neutral-50/50 dark:bg-neutral-900/50"
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
            {stripMarkdown(task.description)}
          </p>
        )}
      </div>
    </div>
  );
};
