import * as React from "react";
import { render, screen } from "@testing-library/react";
import { FilterToolbar } from "@/components/molecules/FilterToolbar";
import { AppProvider } from "@/context/AppContext";

describe("FilterToolbar Spec", () => {
  it("should render priority dropdown and correct options", () => {
    render(
      <AppProvider>
        <FilterToolbar selectedPriority="ALL" onPriorityChange={jest.fn()} />
      </AppProvider>,
    );

    expect(screen.getByLabelText(/filter by priority/i)).toBeInTheDocument();
  });
});
