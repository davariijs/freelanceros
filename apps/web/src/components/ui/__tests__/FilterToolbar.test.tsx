import * as React from "react";
import { render, screen } from "@/testing/test-utils";
import { FilterToolbar } from "@/components/ui/FilterToolbar";

describe("FilterToolbar Spec", () => {
  it("should render priority dropdown and correct options", () => {
    const mockFilters = { priority: "ALL", client: "ALL", status: "ALL" };

    render(<FilterToolbar filters={mockFilters} onFilterChange={jest.fn()} />);

    expect(screen.getByText(/filter by priority/i)).toBeInTheDocument();
  });
});
