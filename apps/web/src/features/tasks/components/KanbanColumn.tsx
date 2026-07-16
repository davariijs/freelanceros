"use client";

import * as React from "react";
import { Task, TaskStatus } from "@/features/tasks/schemas/task.schema";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  columnTasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  columnTasks,
  onTaskClick,
}) => {
  const { t, setActiveTaskId } = useApp();

  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 min-h-125 max-h-150 md:max-h-150 h-full flex flex-col gap-4 transition-colors",
        isOver ? "bg-neutral-200/50 dark:bg-neutral-800/40" : color,
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

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700">
        {columnTasks.length === 0 ? (
          <div className="grow flex items-center justify-center p-8 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl">
            <p className="text-xs text-neutral-400">{t.noTasks}</p>
          </div>
        ) : (
          columnTasks.map((task) => {
            return (
              <div
                key={task.id}
                onClick={() => {
                  setActiveTaskId(task.id);
                  onTaskClick(task);
                }}
                className={cn("transition-all duration-200 rounded-xl")}
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
