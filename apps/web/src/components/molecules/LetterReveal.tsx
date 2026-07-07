"use client";

import { motion } from "framer-motion";

interface LetterRevealProps {
  text: string;
  active: boolean;
}

export function LetterReveal({ text, active }: LetterRevealProps) {
  const letters = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: "blur(12px)",
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: { type: "spring" as const, stiffness: 120, damping: 12 },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      className="flex flex-wrap"
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-linear-to-b from-neutral-900 via-neutral-800 to-neutral-600 dark:from-neutral-50 dark:via-neutral-100 dark:to-neutral-400"
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}
