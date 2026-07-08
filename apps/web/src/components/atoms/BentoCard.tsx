"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export function BentoCard({
  children,
  className = "",
  active = false,
}: BentoCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);

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

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: xSpring,
        rotateY: ySpring,
        transformStyle: "preserve-3d",
      }}
      className={`p-6 h-full w-full rounded-3xl border backdrop-blur-md shadow-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-700 cursor-default ${
        active
          ? "border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.15)] bg-neutral-950/40"
          : "border-neutral-300/10 dark:border-neutral-800/10 bg-neutral-950/20"
      } ${className}`}
    >
      <div
        style={{ transform: "translateZ(30px)" }}
        className="h-full flex flex-col justify-between"
      >
        {children}
      </div>
    </motion.div>
  );
}
