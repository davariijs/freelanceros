import * as React from "react";
import { render, screen } from "@testing-library/react";
import { FormField } from "@/components/molecules/FormField";
import { AppProvider } from "@/context/AppContext";

describe("FormField Molecule A11y & Spec", () => {
  it("should associate label with input using generated id", () => {
    render(
      <AppProvider>
        <FormField label="Email Address" />
      </AppProvider>,
    );
    const input = screen.getByLabelText(/email address/i);
    expect(input).toBeInTheDocument();
  });

  it("should display error message and link to input with aria-describedby", () => {
    render(
      <AppProvider>
        <FormField label="Password" errorMessage="Password is too short" />
      </AppProvider>,
    );
    const input = screen.getByLabelText(/password/i);
    const errorText = screen.getByRole("alert");

    expect(errorText).toBeInTheDocument();
    expect(errorText.textContent).toBe("Password is too short");
    expect(input).toHaveAttribute("aria-describedby", `${input.id}-error`);
  });
});
