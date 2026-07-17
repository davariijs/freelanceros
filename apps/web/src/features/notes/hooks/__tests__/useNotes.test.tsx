"use client";

import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppProvider } from "@/context/AppContext";
import {
  useNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "@/features/notes/hooks/useNotes";
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

describe("useNotes Hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch notes successfully", async () => {
    const mockNotes = [
      {
        id: "1",
        title: "Note 1",
        content: "Content",
        userId: "u1",
        createdAt: "2026",
        updatedAt: "2026",
      },
    ];
    const mockGet = apiClient.get as jest.Mock;
    mockGet.mockResolvedValueOnce({ data: mockNotes });

    const { result } = renderHook(() => useNotesQuery(), {
      wrapper: ProviderWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockNotes);
  });

  it("should create a note with default title successfully", async () => {
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({
      data: { id: "2", title: "Untitled Note", content: "" },
    });

    const { result } = renderHook(() => useCreateNoteMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPost).toHaveBeenCalledWith("/notes", {
      title: "Untitled Note",
      content: "",
    });
  });

  it("should update a note successfully", async () => {
    const updatePayload = { id: "1", title: "Updated", content: "New Content" };
    const mockPatch = apiClient.patch as jest.Mock;
    mockPatch.mockResolvedValueOnce({ data: updatePayload });

    const { result } = renderHook(() => useUpdateNoteMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate(updatePayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPatch).toHaveBeenCalledWith("/notes/1", {
      title: "Updated",
      content: "New Content",
    });
  });

  it("should delete a note successfully", async () => {
    const mockDelete = apiClient.delete as jest.Mock;
    mockDelete.mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useDeleteNoteMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate("1");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDelete).toHaveBeenCalledWith("/notes/1");
  });
});
