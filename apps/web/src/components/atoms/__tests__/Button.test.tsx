import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "@/components/atoms/Button";

describe("Accessible Button Atom", () => {
  it("should render correct children content", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});
