"use client";

import { motion } from "framer-motion";

interface SlideFillButtonProps {
  label: string;
}

export function SlideFillButton({ label }: SlideFillButtonProps) {
  return (
    <motion.button
      whileHover="hover"
      whileTap="tap"
      initial="initial"
      variants={{
        initial: { scale: 1 },
        hover: { scale: 1.05, y: -2 },
        tap: { scale: 0.98 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-neutral-300/50 dark:border-neutral-800/50 font-semibold rounded-2xl backdrop-blur-md cursor-pointer text-sm overflow-hidden relative text-neutral-800 dark:text-neutral-200"
    >
      <span className="relative z-10">{label}</span>
      <motion.span
        variants={{
          initial: { y: "100%" },
          hover: { y: "0%" },
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute inset-0 bg-neutral-900/10 dark:bg-white/10 z-0 pointer-events-none"
      />
    </motion.button>
  );
}
