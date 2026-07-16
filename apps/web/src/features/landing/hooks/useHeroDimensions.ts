import { useState, useEffect } from "react";

export function useHeroDimensions() {
  const [dimensions, setDimensions] = useState({ width: 0, isMobile: false });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        isMobile: window.innerWidth < 768,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
}
