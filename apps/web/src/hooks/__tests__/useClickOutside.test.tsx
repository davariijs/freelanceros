import React, { useRef } from "react";
import { render, fireEvent } from "@/testing/test-utils";
import { useClickOutside } from "@/hooks/useClickOutside";

const TestComponent = ({ handler }: { handler: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, handler);

  return (
    <div>
      <div ref={ref} data-testid="inside-element">
        Inside Content
      </div>
      <div data-testid="outside-element">Outside Content</div>
    </div>
  );
};

describe("useClickOutside Hook", () => {
  it("should trigger handler when clicking outside of the element", () => {
    const mockHandler = jest.fn();
    const { getByTestId } = render(<TestComponent handler={mockHandler} />);

    fireEvent.mouseDown(getByTestId("outside-element"));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it("should NOT trigger handler when clicking inside of the element", () => {
    const mockHandler = jest.fn();
    const { getByTestId } = render(<TestComponent handler={mockHandler} />);

    fireEvent.mouseDown(getByTestId("inside-element"));
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should trigger handler when Escape key is pressed", () => {
    const mockHandler = jest.fn();
    render(<TestComponent handler={mockHandler} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
