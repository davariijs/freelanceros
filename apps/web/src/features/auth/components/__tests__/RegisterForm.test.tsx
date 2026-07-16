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
      Sign up with Google
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

jest.mock("@/lib/apiClient", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

import { render, fireEvent, waitFor } from "@/testing/test-utils";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
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
      statusText: "BadRequest",
      headers: {},
      config: { headers } as InternalAxiosRequestConfig,
    },
  };
};

describe("RegisterForm Component", () => {
  let cookieStore: string = "";

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

  it("should show validation errors when fields are empty on submit", async () => {
    const { container, findByText } = render(<RegisterForm />);

    const submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    expect(
      await findByText("Name must be at least 2 characters"),
    ).toBeInTheDocument();
    expect(await findByText("Invalid email address")).toBeInTheDocument();
    expect(
      await findByText("Password must be at least 6 characters"),
    ).toBeInTheDocument();
  });

  it("should successfully request registration and transition to OTP verification step", async () => {
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({ data: { success: true } });

    const { container, findByText } = render(<RegisterForm />);

    const nameInput = container.querySelector(
      'input[name="name"]',
    ) as HTMLInputElement;
    const emailInput = container.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;
    const passwordInput = container.querySelector(
      'input[name="password"]',
    ) as HTMLInputElement;
    const submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/auth/register-request", {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });
    });

    expect(await findByText(/Confirm your Email/i)).toBeInTheDocument();
  });

  it("should complete signup when a valid 6-digit OTP is provided", async () => {
    const mockPost = apiClient.post as jest.Mock;

    mockPost.mockResolvedValueOnce({ data: { success: true } });
    mockPost.mockResolvedValueOnce({ data: { accessToken: "jwt_token_otp" } });

    const { container, getByPlaceholderText } = render(<RegisterForm />);

    fireEvent.change(
      container.querySelector('input[name="name"]') as HTMLInputElement,
      { target: { value: "John Doe" } },
    );
    fireEvent.change(
      container.querySelector('input[name="email"]') as HTMLInputElement,
      { target: { value: "john@example.com" } },
    );
    fireEvent.change(
      container.querySelector('input[name="password"]') as HTMLInputElement,
      { target: { value: "password123" } },
    );
    fireEvent.click(
      container.querySelector('button[type="submit"]') as HTMLButtonElement,
    );

    const otpInput = await waitFor(
      () => getByPlaceholderText("000000") as HTMLInputElement,
    );
    fireEvent.change(otpInput, { target: { value: "123456" } });
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    await waitFor(() => {
      expect(mockPost).toHaveBeenLastCalledWith("/auth/register-verify", {
        email: "john@example.com",
        code: "123456",
      });
      expect(document.cookie).toContain("token=jwt_token_otp");
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should display verification error when OTP is incorrect", async () => {
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({ data: { success: true } });
    mockPost.mockRejectedValueOnce(
      createMockAxiosError("Invalid or expired verification code", 400),
    );

    const { container, getByPlaceholderText, findByRole } = render(
      <RegisterForm />,
    );

    fireEvent.change(
      container.querySelector('input[name="name"]') as HTMLInputElement,
      { target: { value: "John" } },
    );
    fireEvent.change(
      container.querySelector('input[name="email"]') as HTMLInputElement,
      { target: { value: "john@example.com" } },
    );
    fireEvent.change(
      container.querySelector('input[name="password"]') as HTMLInputElement,
      { target: { value: "password" } },
    );
    fireEvent.click(
      container.querySelector('button[type="submit"]') as HTMLButtonElement,
    );

    const otpInput = await waitFor(
      () => getByPlaceholderText("000000") as HTMLInputElement,
    );
    fireEvent.change(otpInput, { target: { value: "000000" } });
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    const errorAlert = await findByRole("alert");
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert.textContent).toBe("Invalid or expired verification code");
  });
});
