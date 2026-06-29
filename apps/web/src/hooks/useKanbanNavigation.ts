"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Task, TaskStatus } from "@/schemas/task";
import { useUpdateTaskMutation } from "@/hooks/useTasks";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface UseKanbanNavigationProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function useKanbanNavigation({
  tasks,
  onTaskClick,
}: UseKanbanNavigationProps) {
  const { activeTaskId, setActiveTaskId, isCommandOpen } = useApp();
  const updateTaskMutation = useUpdateTaskMutation();

  const getColumnTasks = React.useCallback(
    (status: TaskStatus) => tasks.filter((task) => task.status === status),
    [tasks],
  );

  const orderedTasks = React.useMemo(() => {
    return ["TODO", "IN_PROGRESS", "DONE"].flatMap((status) =>
      getColumnTasks(status as TaskStatus),
    );
  }, [getColumnTasks]);

  const handleNextTask = React.useCallback(() => {
    if (orderedTasks.length === 0) return;
    if (!activeTaskId) {
      setActiveTaskId(orderedTasks[0].id);
      return;
    }
    const currentIndex = orderedTasks.findIndex((t) => t.id === activeTaskId);
    const nextIndex = (currentIndex + 1) % orderedTasks.length;
    setActiveTaskId(orderedTasks[nextIndex].id);
  }, [orderedTasks, activeTaskId, setActiveTaskId]);

  const handlePrevTask = React.useCallback(() => {
    if (orderedTasks.length === 0) return;
    if (!activeTaskId) {
      setActiveTaskId(orderedTasks[orderedTasks.length - 1].id);
      return;
    }
    const currentIndex = orderedTasks.findIndex((t) => t.id === activeTaskId);
    const prevIndex =
      (currentIndex - 1 + orderedTasks.length) % orderedTasks.length;
    setActiveTaskId(orderedTasks[prevIndex].id);
  }, [orderedTasks, activeTaskId, setActiveTaskId]);

  const handleToggleStatus = React.useCallback(() => {
    if (!activeTaskId) return;
    const currentTask = orderedTasks.find((t) => t.id === activeTaskId);
    if (!currentTask) return;

    let nextStatus: TaskStatus = "TODO";
    if (currentTask.status === "TODO") nextStatus = "IN_PROGRESS";
    else if (currentTask.status === "IN_PROGRESS") nextStatus = "DONE";

    updateTaskMutation.mutate({ id: activeTaskId, status: nextStatus });
  }, [activeTaskId, orderedTasks, updateTaskMutation]);

  const handleOpenActiveTask = React.useCallback(() => {
    if (!activeTaskId) return;
    const task = orderedTasks.find((t) => t.id === activeTaskId);
    if (task) {
      onTaskClick(task);
    }
  }, [activeTaskId, orderedTasks, onTaskClick]);

  const handleCancelSelection = React.useCallback(() => {
    setActiveTaskId(null);
  }, [setActiveTaskId]);

  useKeyboardShortcuts({
    onCtrlK: () => {},
    onJ: !isCommandOpen ? handleNextTask : undefined,
    onK: !isCommandOpen ? handlePrevTask : undefined,
    onSpace: !isCommandOpen ? handleToggleStatus : undefined,
    onEnter: !isCommandOpen ? handleOpenActiveTask : undefined,
    onEsc: !isCommandOpen ? handleCancelSelection : undefined,
  });

  return { getColumnTasks };
}
