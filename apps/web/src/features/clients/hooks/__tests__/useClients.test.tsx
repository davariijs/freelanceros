"use client";

import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppProvider } from "@/context/AppContext";
import {
  useClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "@/features/clients/hooks/useClients";
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

describe("useClients Hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch clients successfully", async () => {
    const mockClients = [
      {
        id: "1",
        name: "Acme Corp",
        email: "info@acme.com",
        status: "ACTIVE",
        userId: "u1",
        createdAt: "2026",
      },
    ];
    const mockGet = apiClient.get as jest.Mock;
    mockGet.mockResolvedValueOnce({ data: mockClients });

    const { result } = renderHook(() => useClientsQuery(), {
      wrapper: ProviderWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockClients);
  });

  it("should create a client successfully", async () => {
    const newClient = { name: "New Client", email: "new@test.com" };
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({ data: { id: "2", ...newClient } });

    const { result } = renderHook(() => useCreateClientMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate(newClient);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPost).toHaveBeenCalledWith("/clients", newClient);
  });

  it("should update a client successfully", async () => {
    const updatePayload = {
      id: "1",
      name: "Updated Name",
      email: "updated@test.com",
    };
    const mockPatch = apiClient.patch as jest.Mock;
    mockPatch.mockResolvedValueOnce({ data: updatePayload });

    const { result } = renderHook(() => useUpdateClientMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate(updatePayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPatch).toHaveBeenCalledWith("/clients/1", {
      name: "Updated Name",
      email: "updated@test.com",
    });
  });

  it("should delete a client successfully", async () => {
    const mockDelete = apiClient.delete as jest.Mock;
    mockDelete.mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useDeleteClientMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate("1");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDelete).toHaveBeenCalledWith("/clients/1");
  });
});
