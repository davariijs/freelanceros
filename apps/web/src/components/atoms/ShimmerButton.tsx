"use client";

import { motion } from "framer-motion";

interface ShimmerButtonProps {
  label: string;
}

export function ShimmerButton({ label }: ShimmerButtonProps) {
  return (
    <motion.button
      whileHover="hover"
      whileTap="tap"
      initial="initial"
      variants={{
        initial: { scale: 1 },
        hover: {
          scale: 1.05,
          y: -2,
          boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
        },
        tap: { scale: 0.98 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-neutral-950 dark:bg-neutral-50 hover:bg-neutral-900 dark:hover:bg-neutral-200 text-neutral-50 dark:text-neutral-950 font-semibold rounded-2xl cursor-pointer text-sm overflow-hidden relative shadow-lg"
    >
      <span className="relative z-10">{label}</span>
      <motion.span
        variants={{
          initial: { x: "-100%" },
          hover: { x: "200%" },
        }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1,
        }}
        className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/10 dark:via-black/5 to-transparent skew-x-12 pointer-events-none"
      />
    </motion.button>
  );
}
