import { useState, useEffect, useRef, useCallback } from "react";

export type OsState = 0 | 1 | 2 | 3 | 4 | 5;

export function useHeroScrollObserver() {
  const [osState, setOsState] = useState<OsState>(0);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -25% 0px",
      threshold: 0.05,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionsRef.current.indexOf(
            entry.target as HTMLDivElement,
          );
          if (index !== -1) {
            setOsState(index as OsState);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      sectionsRef.current[index] = el;
    },
    [],
  );

  return { osState, setSectionRef };
}
