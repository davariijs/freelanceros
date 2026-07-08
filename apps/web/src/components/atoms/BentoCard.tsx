"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useApp } from "@/context/AppContext";

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

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const springConfig = { damping: 25, stiffness: 220 };
  const xSpring = useSpring(rotateX, springConfig);
  const ySpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: xSpring,
        rotateY: ySpring,
        transformStyle: "preserve-3d",
      }}
      className={`p-6 h-full w-full rounded-[28px] border backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-700 cursor-default ${
        isDark
          ? "bg-[#09090e]/85 text-neutral-50"
          : "bg-white/92 text-neutral-900"
      } ${getBorderGlow()} ${className}`}
    >
      {isDark && (
        <div
          className="absolute -top-20 -left-20 w-44 h-48 rounded-full opacity-60 blur-3xl pointer-events-none"
          style={{ backgroundColor: glowColor.replace("0.15", "0.08") }}
        />
      )}

      <div
        style={{ transform: "translateZ(30px)" }}
        className="h-full flex flex-col justify-between relative z-10"
      >
        {children}
      </div>
    </motion.div>
  );
}
