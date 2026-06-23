import * as React from "react";
import { render, screen } from "@/utils/test-utils";
import { FormField } from "@/components/molecules/FormField";

describe("FormField Molecule A11y & Spec", () => {
  it("should associate label with input using generated id", () => {
    render(<FormField label="Email Address" />);
    const input = screen.getByLabelText(/email address/i);
    expect(input).toBeInTheDocument();
  });

  it("should display error message and link to input with aria-describedby", () => {
    render(<FormField label="Password" errorMessage="Password is too short" />);
    const input = screen.getByLabelText(/password/i);
    const errorText = screen.getByRole("alert");

    expect(errorText).toBeInTheDocument();
    expect(errorText.textContent).toBe("Password is too short");
    expect(input).toHaveAttribute("aria-describedby", `${input.id}-error`);
  });
});
