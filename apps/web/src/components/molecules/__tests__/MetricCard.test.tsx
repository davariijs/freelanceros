import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "@/components/molecules/MetricCard";

describe("MetricCard Molecule Spec", () => {
  it("should render title and value correctly", () => {
    render(<MetricCard title="Tasks" value="12" />);
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("should render optional description when provided", () => {
    render(<MetricCard title="Tasks" value="12" description="5 remaining" />);
    expect(screen.getByText("5 remaining")).toBeInTheDocument();
  });
});
