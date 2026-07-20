"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { renderHook } from "@testing-library/react";
import { useKanbanNavigation } from "@/features/tasks/hooks/useKanbanNavigation";
import { useApp } from "@/context/AppContext";
import { useUpdateTaskMutation } from "@/features/tasks/hooks/useTasks";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Task } from "@/features/tasks/schemas/task.schema";

jest.mock("@/context/AppContext", () => ({
  useApp: jest.fn(),
}));

jest.mock("@/features/tasks/hooks/useTasks", () => ({
  useUpdateTaskMutation: jest.fn(),
}));

jest.mock("@/hooks/useKeyboardShortcuts", () => ({
  useKeyboardShortcuts: jest.fn(),
}));

describe("useKanbanNavigation Hook", () => {
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "T1",
      status: "TODO",
      priority: "MEDIUM",
      createdAt: "2",
      order: 0,
    },
    {
      id: "2",
      title: "T2",
      status: "IN_PROGRESS",
      priority: "HIGH",
      createdAt: "2",
      order: 1,
    },
  ];

  const mockSetActiveTaskId = jest.fn();
  const mockMutate = jest.fn();
  const mockOnTaskClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useApp as jest.Mock).mockReturnValue({
      activeTaskId: null,
      setActiveTaskId: mockSetActiveTaskId,
      isCommandOpen: false,
    });

    (useUpdateTaskMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    });
  });

  it("should categorize tasks by columns correctly", () => {
    const { result } = renderHook(() =>
      useKanbanNavigation({ tasks: mockTasks, onTaskClick: mockOnTaskClick }),
    );

    const todoTasks = result.current.getColumnTasks("TODO");
    const progressTasks = result.current.getColumnTasks("IN_PROGRESS");

    expect(todoTasks).toHaveLength(1);
    expect(todoTasks[0].id).toBe("1");
    expect(progressTasks).toHaveLength(1);
    expect(progressTasks[0].id).toBe("2");
  });

  it("should bind keyboard shortcuts with keyboard shortcuts hook", () => {
    renderHook(() =>
      useKanbanNavigation({ tasks: mockTasks, onTaskClick: mockOnTaskClick }),
    );

    expect(useKeyboardShortcuts).toHaveBeenCalledWith(
      expect.objectContaining({
        onJ: expect.any(Function),
        onK: expect.any(Function),
        onSpace: expect.any(Function),
        onEnter: expect.any(Function),
        onEsc: expect.any(Function),
      }),
    );
  });
});
