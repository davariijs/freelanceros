import { renderHook } from "@testing-library/react";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      replace: mockReplace,
    };
  },
}));

describe("useAuthGuard Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should redirect to /login if token is missing in localStorage", () => {
    renderHook(() => useAuthGuard());
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("should NOT redirect to /login if token is present in localStorage", () => {
    localStorage.setItem("token", "mock_valid_user_token");
    renderHook(() => useAuthGuard());
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
