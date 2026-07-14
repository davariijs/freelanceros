"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Task, TaskStatus } from "@/schemas/task";
import { useUpdateTaskMutation } from "@/hooks/useTasks";
import { useKanbanNavigation } from "@/hooks/useKanbanNavigation";
import { KanbanColumn } from "@/components/molecules/KanbanColumn";
import { TaskCard } from "@/components/atoms/TaskCard";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";

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
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 220, tolerance: 6 },
    }),
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const status = over.id as TaskStatus;
      updateTaskMutation.mutate({ id: taskId, status });
    }
  };

  const activeTask = React.useMemo(
    () => tasks.find((t) => t.id === activeId),
    [tasks, activeId],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-6 md:grid-cols-3 h-full items-start">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            columnTasks={getColumnTasks(column.id)}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="scale-105 rotate-1 shadow-2xl">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
