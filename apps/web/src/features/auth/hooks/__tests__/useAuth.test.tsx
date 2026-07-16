"use client";

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppProvider } from "@/context/AppContext";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/features/auth/hooks//useAuth";
import { apiClient } from "@/lib/apiClient";

jest.mock("@/lib/apiClient", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <AppProvider initialLocale="en" initialTheme="dark">
      {children}
    </AppProvider>
  </QueryProvider>
);

describe("useAuth Mutation Hooks", () => {
  let cookieStore = "";

  beforeEach(() => {
    jest.clearAllMocks();
    cookieStore = "";

    Object.defineProperty(document, "cookie", {
      get: () => cookieStore,
      set: (val: string) => {
        cookieStore = val;
      },
      configurable: true,
    });
  });

  it("useLoginMutation should post data and set authentication cookie on success", async () => {
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({
      data: { accessToken: "jwt_login_token" },
    });

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate({
        email: "user@example.com",
        password: "password123",
      });
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockPost).toHaveBeenCalledWith("/auth/login", {
      email: "user@example.com",
      password: "password123",
    });
    expect(document.cookie).toContain("token=jwt_login_token");
  });

  it("useRegisterMutation should post data and set authentication cookie on success", async () => {
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({
      data: { accessToken: "jwt_register_token" },
    });

    const { result } = renderHook(() => useRegisterMutation(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.mutate({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockPost).toHaveBeenCalledWith("/auth/register", {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });
    expect(document.cookie).toContain("token=jwt_register_token");
  });
});
