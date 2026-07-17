import { renderHook, act } from "@testing-library/react";
import { useHeroDimensions } from "@/features/landing/hooks/useHeroDimensions";

describe("useHeroDimensions Hook", () => {
  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it("should return correct mobile dimensions when window width is less than 768px", () => {
    setWindowWidth(500);

    const { result } = renderHook(() => useHeroDimensions());

    expect(result.current.width).toBe(500);
    expect(result.current.isMobile).toBe(true);
  });

  it("should return correct desktop dimensions when window width is greater than 768px", () => {
    setWindowWidth(1024);

    const { result } = renderHook(() => useHeroDimensions());

    expect(result.current.width).toBe(1024);
    expect(result.current.isMobile).toBe(false);
  });

  it("should update dimensions on window resize event", () => {
    setWindowWidth(1024);
    const { result } = renderHook(() => useHeroDimensions());

    expect(result.current.width).toBe(1024);
    expect(result.current.isMobile).toBe(false);

    act(() => {
      setWindowWidth(600);
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBe(600);
    expect(result.current.isMobile).toBe(true);
  });
});
