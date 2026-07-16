import React from "react";
import { render, fireEvent } from "@/testing/test-utils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const KeyboardTestComponent = ({ options }: { options: any }) => {
  useKeyboardShortcuts(options);
  return (
    <div>
      <input data-testid="test-input" type="text" />
      <textarea data-testid="test-textarea" />
    </div>
  );
};

describe("useKeyboardShortcuts Hook", () => {
  let mockOptions: any;

  beforeEach(() => {
    mockOptions = {
      onCtrlK: jest.fn(),
      onJ: jest.fn(),
      onK: jest.fn(),
      onSpace: jest.fn(),
      onEnter: jest.fn(),
      onEsc: jest.fn(),
    };
  });

  it("should trigger onCtrlK on Ctrl+K key combination", () => {
    render(<KeyboardTestComponent options={mockOptions} />);

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(mockOptions.onCtrlK).toHaveBeenCalledTimes(1);
  });

  it("should trigger onJ on 'j' or 'ArrowDown' press", () => {
    render(<KeyboardTestComponent options={mockOptions} />);

    fireEvent.keyDown(window, { key: "j" });
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(mockOptions.onJ).toHaveBeenCalledTimes(2);
  });

  it("should trigger onK on 'k' or 'ArrowUp' press", () => {
    render(<KeyboardTestComponent options={mockOptions} />);

    fireEvent.keyDown(window, { key: "k" });
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(mockOptions.onK).toHaveBeenCalledTimes(2);
  });

  it("should trigger onSpace on Space key press", () => {
    render(<KeyboardTestComponent options={mockOptions} />);

    fireEvent.keyDown(window, { key: " " });
    expect(mockOptions.onSpace).toHaveBeenCalledTimes(1);
  });

  it("should trigger onEnter on Enter press", () => {
    render(<KeyboardTestComponent options={mockOptions} />);

    fireEvent.keyDown(window, { key: "Enter" });
    expect(mockOptions.onEnter).toHaveBeenCalledTimes(1);
  });

  it("should trigger onEsc on Escape press", () => {
    render(<KeyboardTestComponent options={mockOptions} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockOptions.onEsc).toHaveBeenCalledTimes(1);
  });

  it("should NOT trigger navigation shortcuts (like J/K) when focused inside input elements", () => {
    const { getByTestId } = render(
      <KeyboardTestComponent options={mockOptions} />,
    );
    const input = getByTestId("test-input");

    input.focus();
    fireEvent.keyDown(input, { key: "j" });

    expect(mockOptions.onJ).not.toHaveBeenCalled();
  });

  it("should STILL trigger onCtrlK even if the active element is an input", () => {
    const { getByTestId } = render(
      <KeyboardTestComponent options={mockOptions} />,
    );
    const input = getByTestId("test-input");

    input.focus();
    fireEvent.keyDown(input, { key: "k", ctrlKey: true });

    expect(mockOptions.onCtrlK).toHaveBeenCalledTimes(1);
  });

  it("should STILL trigger onEsc even if the active element is an input", () => {
    const { getByTestId } = render(
      <KeyboardTestComponent options={mockOptions} />,
    );
    const input = getByTestId("test-input");

    input.focus();
    fireEvent.keyDown(input, { key: "Escape" });

    expect(mockOptions.onEsc).toHaveBeenCalledTimes(1);
  });
});
