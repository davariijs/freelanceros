"use client";

import * as React from "react";
import { motion, useMotionValue } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useIsMobile } from "@/hooks/useIsMobile";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  glowColor?: string;
}

export function BentoCard({
  children,
  className = "",
  active = false,
  glowColor = "rgba(16,185,129,0.15)",
}: BentoCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { theme } = useApp();
  const isDark = theme === "dark";
  const isMobile = useIsMobile();

  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setMousePos({ x: mouseX, y: mouseY });

    const rX = mouseY / height - 0.5;
    const rY = mouseX / width - 0.5;
    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getBorderGlow = () => {
    if (!active) return "border-neutral-200/60 dark:border-neutral-800/40";
    return isDark
      ? `border-emerald-500/30 shadow-[0_0_40px_${glowColor}]`
      : "border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]";
  };

  return (
    <motion.div
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
      className={`p-6 md:p-2 lg:p-6 h-full w-full rounded-[28px] border ${
        !isMobile ? "backdrop-blur-2xl" : ""
      } flex flex-col justify-between relative overflow-hidden transition-all duration-700 cursor-default ${
        isDark
          ? "bg-[#09090e]/85 text-neutral-50"
          : "bg-white/92 text-neutral-900"
      } ${getBorderGlow()} ${className} group`}
    >
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(130px circle at ${mousePos.x}px ${mousePos.y}px, ${
            isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)"
          }, transparent 80%)`,
        }}
      />

      <div
        className="absolute w-36 h-36 border border-emerald-500/30 bg-emerald-500/3 rounded-full pointer-events-none blur-[0.5px] transition-transform duration-75 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:scale-110 z-0 shadow-[0_0_30px_rgba(16,185,129,0.08)]"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      <div
        style={
          isMobile
            ? undefined
            : {
                transform: "translateZ(30px)",
              }
        }
        className="h-full flex flex-col justify-between relative z-10 transition-transform duration-500 ease-out group-hover:scale-[1.025]"
      >
        {children}
      </div>
    </motion.div>
  );
}
