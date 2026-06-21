import * as React from "react";
import { render, screen } from "@testing-library/react";
import { LoginForm } from "@/components/organisms/LoginForm";
import { AppProvider } from "@/context/AppContext";
import { QueryProvider } from "@/providers/QueryProvider";

describe("LoginForm Organism Unit Spec (TDD)", () => {
  it("should render the login form fields and submit button correctly", () => {
    render(
      <QueryProvider>
        <AppProvider>
          <LoginForm />
        </AppProvider>
      </QueryProvider>,
    );

    expect(
      screen.getByLabelText("Email Address", { selector: "input" }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Password", { selector: "input" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });
});
