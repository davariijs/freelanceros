import type { OsState } from "@/features/landing/hooks/useHeroScrollObserver";

export const getDeskAnimationConfig = (
  osState: OsState,
  isMobile: boolean,
  windowWidth: number,
) => {
  if (osState >= 2) {
    return { x: "0%", y: isMobile ? "-100px" : "-180px", opacity: 1 };
  }

  if (osState === 1) {
    if (isMobile) {
      return { x: "0%", y: "-140px", opacity: 1 };
    }
    let xShift = "22%";
    if (windowWidth >= 1450 && windowWidth <= 1669) {
      xShift = "27%";
    } else if (windowWidth >= 768 && windowWidth < 1450) {
      xShift = "19%";
    }
    return { x: xShift, y: "0px", opacity: 1 };
  }

  return { x: "0%", y: "0px", opacity: 1 };
};
