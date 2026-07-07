"use client";

import { motion } from "framer-motion";

interface StatusDotProps {
  active: boolean;
  activeColor: string;
  inactiveColor: string;
}

export function StatusDot({
  active,
  activeColor,
  inactiveColor,
}: StatusDotProps) {
  return (
    <motion.span
      layout
      className={`h-2.5 w-2.5 rounded-full ${
        active
          ? `${activeColor} shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse`
          : `${inactiveColor} animate-pulse`
      }`}
    />
  );
}
