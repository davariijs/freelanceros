import * as React from "react";
import { render, screen } from "@/utils/test-utils";
import { LoginForm } from "@/components/organisms/LoginForm";

describe("LoginForm Organism Unit Spec (TDD)", () => {
  it("should render the login form fields and submit button correctly", () => {
    render(<LoginForm />);

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
