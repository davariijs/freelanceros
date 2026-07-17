"use client";

import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/context/AppContext";
import {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/features/tasks/hooks/useTasks";
import { apiClient } from "@/lib/apiClient";
import { Task } from "@/features/tasks/schemas/task.schema";

jest.mock("@/lib/apiClient", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("useTasks Hooks", () => {
  let queryClient: QueryClient;
  let ProviderWrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    jest.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
        },
      },
    });

    ProviderWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AppProvider initialLocale="en" initialTheme="dark">
          {children}
        </AppProvider>
      </QueryClientProvider>
    );
  });

  it("should fetch tasks successfully", async () => {
    const mockTasks = [
      {
        id: "1",
        title: "Task 1",
        status: "TODO" as const,
        priority: "MEDIUM" as const,
        userId: "u1",
        createdAt: "2026",
        order: 0,
      },
    ];
    const mockGet = apiClient.get as jest.Mock;
    mockGet.mockResolvedValueOnce({ data: mockTasks });

    const { result } = renderHook(() => useTasksQuery(), {
      wrapper: ProviderWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTasks);
  });

  it("should create a task successfully", async () => {
    const newTask = {
      title: "New Task",
      description: "Desc",
      priority: "HIGH" as const,
      status: "TODO" as const,
    };
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({ data: { id: "2", ...newTask, order: 0 } });

    const { result } = renderHook(() => useCreateTaskMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate(newTask);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPost).toHaveBeenCalledWith("/tasks", newTask);
  });

  it("should perform optimistic update on client cache when updating task status", async () => {
    const mockPatch = apiClient.patch as jest.Mock;
    mockPatch.mockResolvedValueOnce({
      data: { id: "1", status: "IN_PROGRESS" },
    });

    queryClient.setQueryData(
      ["tasks"],
      [
        {
          id: "1",
          title: "Task 1",
          status: "TODO",
          order: 0,
          priority: "MEDIUM",
          userId: "u1",
          createdAt: "2026",
        },
      ],
    );

    const { result: updateResult } = renderHook(() => useUpdateTaskMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      updateResult.current.mutate({ id: "1", status: "IN_PROGRESS" });
    });

    await waitFor(() => {
      const cachedTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      expect(cachedTasks?.[0].status).toBe("IN_PROGRESS");
    });

    await waitFor(() => expect(updateResult.current.isSuccess).toBe(true));
  });

  it("should delete a task successfully", async () => {
    const mockDelete = apiClient.delete as jest.Mock;
    mockDelete.mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useDeleteTaskMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate("1");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDelete).toHaveBeenCalledWith("/tasks/1");
  });
});
