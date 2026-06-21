import * as React from "react";
import { render, screen } from "@testing-library/react";
import { KanbanBoard } from "@/components/organisms/KanbanBoard";
import { AppProvider } from "@/context/AppContext";
import { QueryProvider } from "@/providers/QueryProvider";

describe("KanbanBoard Organism Spec", () => {
  it("should render all three kanban columns correctly", () => {
    render(
      <QueryProvider>
        <AppProvider>
          <KanbanBoard tasks={[]} />
        </AppProvider>
      </QueryProvider>,
    );

    expect(screen.getByText(/to do/i)).toBeInTheDocument();
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });
});
