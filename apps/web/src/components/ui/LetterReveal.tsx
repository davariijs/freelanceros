"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface LetterRevealProps {
  text?: string;
  active: boolean;
}

export const LetterReveal = React.memo(
  ({ text = "", active }: LetterRevealProps) => {
    const letters = Array.from(text || "");

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
        y: 20,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring" as const,
          stiffness: 120,
          damping: 14,
        },
      },
    } as const;

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        className="flex flex-wrap justify-center md:justify-start"
      >
        {letters.map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-linear-to-b from-neutral-900 via-neutral-800 to-neutral-600 dark:from-neutral-50 dark:via-neutral-100 dark:to-neutral-400 dark:drop-shadow-none dark:[-webkit-text-stroke:0px]"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    );
  },
);

LetterReveal.displayName = "LetterReveal";
