"use client";

import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppProvider } from "@/context/AppContext";
import { useActivityLogsQuery } from "@/features/activity-logs/hooks/useActivityLogs";
import { apiClient } from "@/lib/apiClient";

jest.mock("@/lib/apiClient", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <AppProvider initialLocale="en" initialTheme="dark">
      {children}
    </AppProvider>
  </QueryProvider>
);

describe("useActivityLogsQuery Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and return activity logs successfully", async () => {
    const mockLogs = [
      {
        id: "1",
        action: "TASK_CREATED",
        metadata: "{}",
        createdAt: "2026-07-07T12:00:00Z",
      },
    ];
    const mockGet = apiClient.get as jest.Mock;
    mockGet.mockResolvedValueOnce({ data: mockLogs });

    const { result } = renderHook(() => useActivityLogsQuery(), {
      wrapper: ProviderWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGet).toHaveBeenCalledWith("/activity-logs");
    expect(result.current.data).toEqual(mockLogs);
  });
});
