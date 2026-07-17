import { renderHook, act } from "@testing-library/react";
import { useHeroScrollObserver } from "@/features/landing/hooks/useHeroScrollObserver";

let mockObserverCallback: (
  entries: IntersectionObserverEntry[],
) => void = () => {};
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

const MockIntersectionObserver = jest
  .fn()
  .mockImplementation(
    (callback: (entries: IntersectionObserverEntry[]) => void) => {
      mockObserverCallback = callback;
      return {
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      };
    },
  );

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

describe("useHeroScrollObserver Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initial osState as 0", () => {
    const { result } = renderHook(() => useHeroScrollObserver());
    expect(result.current.osState).toBe(0);
  });

  it("should update osState when an observed element intersects", () => {
    const element0 = document.createElement("div");
    const element1 = document.createElement("div");

    const { result } = renderHook(() => {
      const state = useHeroScrollObserver();
      state.setSectionRef(0)(element0);
      state.setSectionRef(1)(element1);
      return state;
    });

    expect(mockObserve).toHaveBeenCalledTimes(2);

    const mockEntry = {
      isIntersecting: true,
      target: element1,
    } as unknown as IntersectionObserverEntry;

    act(() => {
      mockObserverCallback([mockEntry]);
    });

    expect(result.current.osState).toBe(1);
  });
});
