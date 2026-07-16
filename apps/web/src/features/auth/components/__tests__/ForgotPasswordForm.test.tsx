import React from "react";

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
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
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

describe("ForgotPasswordForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully request code via email and step to reset-verification form", async () => {
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockResolvedValueOnce({ data: { success: true } });

    const { container, findByText } = render(<ForgotPasswordForm />);

    const emailInput = container.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement;
    const submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/auth/reset-request", {
        email: "user@example.com",
      });
    });

    expect(await findByText(/Verify Security Code/i)).toBeInTheDocument();
  });

  it("should display custom error if email is not registered in the system", async () => {
    const mockPost = apiClient.post as jest.Mock;
    mockPost.mockRejectedValueOnce(
      createMockAxiosError("No user registered with this email", 404),
    );

    const { container, findByText } = render(<ForgotPasswordForm />);

    const emailInput = container.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement;
    const submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    fireEvent.change(emailInput, {
      target: { value: "unregistered@example.com" },
    });
    fireEvent.click(submitButton);

    expect(
      await findByText(/Invalid email address or password/i),
    ).toBeInTheDocument();
  });

  it("should reset the password and display success screen on valid code submission", async () => {
    const mockPost = apiClient.post as jest.Mock;

    mockPost.mockResolvedValueOnce({ data: { success: true } });
    mockPost.mockResolvedValueOnce({ data: { success: true } });

    const { container, getByPlaceholderText, findByText } = render(
      <ForgotPasswordForm />,
    );

    fireEvent.change(
      container.querySelector('input[type="email"]') as HTMLInputElement,
      { target: { value: "user@example.com" } },
    );
    fireEvent.click(
      container.querySelector('button[type="submit"]') as HTMLButtonElement,
    );
    const codeInput = await waitFor(
      () => getByPlaceholderText("000000") as HTMLInputElement,
    );
    const passwordInput = container.querySelector(
      'input[placeholder="••••••••"]',
    ) as HTMLInputElement;
    const verifyButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    fireEvent.change(codeInput, { target: { value: "654321" } });
    fireEvent.change(passwordInput, {
      target: { value: "newSecurePassword123" },
    });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockPost).toHaveBeenLastCalledWith("/auth/reset-verify", {
        email: "user@example.com",
        code: "654321",
        newPassword: "newSecurePassword123",
      });
    });
    expect(
      await findByText(/Password updated successfully/i),
    ).toBeInTheDocument();
  });
});
