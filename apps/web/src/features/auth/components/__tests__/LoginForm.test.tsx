import React from "react";
interface GoogleMockProps {
  onSuccess: (response: { credential?: string }) => void;
}
jest.mock("@react-oauth/google", () => ({
  GoogleLogin: ({ onSuccess }: GoogleMockProps) => (
    <button
      data-testid="mock-google-login"
      onClick={() => onSuccess({ credential: "mock_google_id_token" })}
    >
      Sign in with Google
    </button>
  ),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

const mockMutate = jest.fn();
const mockLoginMutation = {
  mutate: mockMutate,
  isPending: false,
  isError: false,
  error: null as AxiosError | null,
};

jest.mock("@/features/auth/hooks/useAuth", () => ({
  useLoginMutation: () => mockLoginMutation,
}));

jest.mock("@/lib/apiClient", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

import { render, fireEvent, waitFor } from "@/testing/test-utils";
import { LoginForm } from "../LoginForm";
import { apiClient } from "@/lib/apiClient";
import { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";

const createMockAxiosError = (message: string, status: number): AxiosError => {
  const headers = new AxiosHeaders();
  return {
    name: "AxiosError",
    message,
    isAxiosError: true,
    toJSON: () => ({}),
    config: { headers } as InternalAxiosRequestConfig,
    response: {
      data: { message },
      status,
      statusText: "Unauthorized",
      headers: {},
      config: { headers } as InternalAxiosRequestConfig,
    },
  };
};

describe("LoginForm Component", () => {
  let cookieStore: string = "";

  beforeEach(() => {
    jest.clearAllMocks();
    cookieStore = "";

    mockLoginMutation.isPending = false;
    mockLoginMutation.isError = false;
    mockLoginMutation.error = null;

    Object.defineProperty(document, "cookie", {
      get: () => cookieStore,
      set: (val: string) => {
        cookieStore = val;
      },
      configurable: true,
    });
  });

  it("should show validation errors when fields are empty and submitted", async () => {
    const { container, findByText } = render(<LoginForm />);
    const submitButton = container.querySelector('button[type="submit"]');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton as HTMLButtonElement);
    expect(await findByText("Invalid email address")).toBeInTheDocument();
    expect(
      await findByText("Password must be at least 6 characters"),
    ).toBeInTheDocument();
  });

  it("should call mutate function with valid credentials on submit", async () => {
    const { container } = render(<LoginForm />);
    const emailInput = container.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;
    const passwordInput = container.querySelector(
      'input[name="password"]',
    ) as HTMLInputElement;
    const submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: "test@example.com", password: "password123" },
        expect.any(Object),
      );
    });
  });

  it("should display server error message when mutation fails", async () => {
    mockLoginMutation.isError = true;
    mockLoginMutation.error = createMockAxiosError("Invalid credentials", 401);

    const { getByRole } = render(<LoginForm />);

    const errorAlert = getByRole("alert");
    expect(errorAlert).toBeInTheDocument();
  });

  it("should handle Google Login success flow, set cookie and redirect", async () => {
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({
      data: { accessToken: "mock_jwt_access_token" },
    });

    const { getByTestId } = render(<LoginForm />);

    fireEvent.click(getByTestId("mock-google-login"));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/auth/google", {
        idToken: "mock_google_id_token",
      });
      expect(document.cookie).toContain("token=mock_jwt_access_token");
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
