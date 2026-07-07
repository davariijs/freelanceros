"use client";

import { motion } from "framer-motion";

interface FeaturesGridProps {
  active: boolean;
}

export function FeaturesGrid({ active }: FeaturesGridProps) {
  const cards = [
    {
      title: "Client CRM",
      desc: "Monitor statuses and automate workflows dynamically.",
    },
    {
      title: "Kanban Board",
      desc: "Prioritize tasks with elegant drag-and-drop features.",
    },
    {
      title: "Linked Notes",
      desc: "Write rich text with automatic background saving.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 18,
        staggerChildren: 0.1,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      className="w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 z-30"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          className="p-6 rounded-3xl border border-neutral-300/10 dark:border-neutral-800/10 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md shadow-2xl shadow-neutral-950/5 flex flex-col gap-3 text-left"
        >
          <h3 className="text-xl font-bold">{card.title}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {card.desc}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
