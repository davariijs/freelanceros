"use client";

import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppProvider } from "@/context/AppContext";
import {
  useProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/features/projects/hooks//useProjects";
import { apiClient } from "@/lib/apiClient";

jest.mock("@/lib/apiClient", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <AppProvider initialLocale="en" initialTheme="dark">
      {children}
    </AppProvider>
  </QueryProvider>
);

describe("useProjects Hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch projects successfully", async () => {
    const mockProjects = [
      {
        id: "1",
        title: "Project 1",
        status: "PLANNING",
        priority: "MEDIUM",
        isShared: false,
        createdAt: "2026",
      },
    ];
    const mockGet = apiClient.get as jest.Mock;
    mockGet.mockResolvedValueOnce({ data: mockProjects });

    const { result } = renderHook(() => useProjectsQuery(), {
      wrapper: ProviderWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockProjects);
  });

  it("should create a project successfully", async () => {
    const newProject = {
      title: "New Project",
      dueDate: "2026-10-10",
      priority: "MEDIUM" as const,
      status: "PLANNING" as const,
    };
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({ data: { id: "2", ...newProject } });

    const { result } = renderHook(() => useCreateProjectMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate(newProject);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPost).toHaveBeenCalledWith("/projects", newProject);
  });

  it("should update a project successfully", async () => {
    const updatePayload = {
      id: "1",
      title: "Updated Project",
      dueDate: "2026-12-12",
      priority: "HIGH" as const,
      status: "ACTIVE" as const,
    };
    const mockPatch = apiClient.patch as jest.Mock;
    mockPatch.mockResolvedValueOnce({ data: updatePayload });

    const { result } = renderHook(() => useUpdateProjectMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate(updatePayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPatch).toHaveBeenCalledWith("/projects/1", {
      title: "Updated Project",
      dueDate: "2026-12-12",
      priority: "HIGH",
      status: "ACTIVE",
    });
  });

  it("should delete a project successfully", async () => {
    const mockDelete = apiClient.delete as jest.Mock;
    mockDelete.mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useDeleteProjectMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate("1");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDelete).toHaveBeenCalledWith("/projects/1");
  });
});
