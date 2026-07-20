import { renderHook, act } from "@/testing/test-utils";
import { useIsMobile } from "@/hooks/useIsMobile";

describe("useIsMobile Hook", () => {
  let mockMatchMedia: jest.Mock;

  beforeEach(() => {
    mockMatchMedia = jest.fn();
    window.matchMedia = mockMatchMedia;
  });

  it("should return false if window width is larger than the breakpoint", () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const { result } = renderHook(() => useIsMobile(768));
    expect(result.current).toBe(false);
  });

  it("should return true if window width is smaller than the breakpoint", () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    const { result } = renderHook(() => useIsMobile(768));
    expect(result.current).toBe(true);
  });

  it("should dynamically update state when media query change event fires", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let triggerChangeEvent: (e: any) => void = () => {};

    mockMatchMedia.mockReturnValue({
      matches: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addEventListener: (event: string, handler: any) => {
        if (event === "change") {
          triggerChangeEvent = handler;
        }
      },
      removeEventListener: jest.fn(),
    });

    const { result } = renderHook(() => useIsMobile(768));
    expect(result.current).toBe(false);

    act(() => {
      triggerChangeEvent({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });
});
