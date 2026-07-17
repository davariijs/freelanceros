"use client";

import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useCommandPaletteData } from "@/features/command-palette/hooks/useCommandPaletteData";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppProvider } from "@/context/AppContext";

jest.mock("@/features/tasks/hooks/useTasks", () => ({
  useTasksQuery: () => ({
    data: [{ id: "t1", title: "Develop API", priority: "HIGH" }],
  }),
  useCreateTaskMutation: () => ({ mutate: jest.fn() }),
}));

jest.mock("@/features/projects/hooks/useProjects", () => ({
  useProjectsQuery: () => ({
    data: [{ id: "p1", title: "React Mobile App", status: "ACTIVE" }],
  }),
  useCreateProjectMutation: () => ({ mutate: jest.fn() }),
}));

jest.mock("@/features/clients/hooks/useClients", () => ({
  useClientsQuery: () => ({
    data: [{ id: "c1", name: "Alpha Corp", email: "corp@alpha.com" }],
  }),
}));

jest.mock("@/features/notes/hooks/useNotes", () => ({
  useNotesQuery: () => ({ data: [{ id: "n1", title: "System Spec" }] }),
}));

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <AppProvider initialLocale="en" initialTheme="dark">
      {children}
    </AppProvider>
  </QueryProvider>
);

describe("useCommandPaletteData Hook", () => {
  const mockOnClose = jest.fn();
  const mockSetQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return navigation shortcuts when query is empty", () => {
    const { result } = renderHook(
      () =>
        useCommandPaletteData({
          query: "",
          setQuery: mockSetQuery,
          onClose: mockOnClose,
        }),
      { wrapper: ProviderWrapper },
    );

    const items = result.current.parsedItems;
    const dashboardNav = items.find((i) => i.id === "nav-dash");
    expect(dashboardNav).toBeDefined();
    expect(dashboardNav?.path).toBe("/dashboard");
  });

  it("should fuzzy search and filter indexed items correctly", async () => {
    const { result } = renderHook(
      () =>
        useCommandPaletteData({
          query: "Develop",
          setQuery: mockSetQuery,
          onClose: mockOnClose,
        }),
      { wrapper: ProviderWrapper },
    );

    await waitFor(() => {
      const items = result.current.parsedItems;
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].title).toBe("Develop API");
    });
  });

  it("should return direct trigger item when writing task prefix command", async () => {
    const { result } = renderHook(
      () =>
        useCommandPaletteData({
          query: "> task Fix bugs",
          setQuery: mockSetQuery,
          onClose: mockOnClose,
        }),
      { wrapper: ProviderWrapper },
    );

    await waitFor(() => {
      const items = result.current.parsedItems;
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("cmd-create-task");
    });
  });
});
