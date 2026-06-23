import * as React from "react";
import { render, screen } from "@/utils/test-utils";
import { KanbanBoard } from "@/components/organisms/KanbanBoard";

describe("KanbanBoard Organism Spec", () => {
  it("should render all three kanban columns correctly", () => {
    render(<KanbanBoard tasks={[]} onTaskClick={jest.fn()} />);

    expect(screen.getByText(/to do/i)).toBeInTheDocument();
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });
});
