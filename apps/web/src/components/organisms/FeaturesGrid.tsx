"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { BentoCard } from "@/components/atoms/BentoCard";

interface FeaturesGridProps {
  osState: 0 | 1 | 2;
}

export function FeaturesGrid({ osState }: FeaturesGridProps) {
  const { t, locale } = useApp();
  const isRtl = locale === "fa";
  const [activeClient, setActiveClient] = React.useState(true);

  const active = osState === 2;

  const containerVariants = {
    hidden: { opacity: 0, y: 150 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 45,
        damping: 18,
        staggerChildren: 0.1,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 60, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 70, damping: 15 },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      className="w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto"
    >
      {/* 1. Client CRM Card */}
      <motion.div variants={cardVariants} className="md:col-span-2 h-64">
        <BentoCard active={active}>
          <div className={isRtl ? "text-right" : ""}>
            <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">
              CRM Engine
            </span>
            <h3 className="text-xl font-bold mt-2">
              {isRtl ? "مدیریت پویای مشتریان" : "Active CRM Engine"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
              {isRtl
                ? t.bentoCrmDesc
                : "Centralize client relationships. Deactivating a client automatically pauses all associated projects instantly."}
            </p>
          </div>

          <div
            dir="ltr"
            className="bg-neutral-900/60 rounded-2xl p-3 border border-neutral-800/50 flex justify-between items-center text-xs mt-4"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2.5 w-2.5 rounded-full ${activeClient ? "bg-emerald-500 animate-pulse" : "bg-neutral-50"}`}
              />
              <div>
                <p className="font-semibold text-[10px] text-neutral-400">
                  Acme Corp
                </p>
                <p className="text-[9px] text-neutral-500 mt-0.5">
                  {activeClient
                    ? t.crmClientActive || "ACTIVE"
                    : t.crmClientInactive || "INACTIVE"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveClient(!activeClient)}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-lg cursor-pointer text-[9px] border border-neutral-700/50 transition-colors"
            >
              {activeClient ? "Deactivate" : "Activate"}
            </button>
          </div>
        </BentoCard>
      </motion.div>

      {/* 2. Kanban Task Board Card */}
      <motion.div variants={cardVariants} className="md:col-span-1 h-64">
        <BentoCard active={active}>
          <div className={isRtl ? "text-right" : ""}>
            <span className="text-[10px] font-black tracking-widest text-sky-500 uppercase">
              Kanban Board
            </span>
            <h3 className="text-xl font-bold mt-2">
              {isRtl ? "بورد کانبان وظایف" : "Kanban Task Board"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
              {isRtl
                ? t.bentoKanbanDesc
                : "Track tasks on an elegant board with responsive drag-and-drop mechanics."}
            </p>
          </div>

          <div
            dir="ltr"
            className="bg-neutral-900/60 rounded-2xl p-3 border border-neutral-800/50 flex gap-2 h-20 overflow-hidden mt-4"
          >
            <div className="flex-1 border-r border-neutral-800/80 pr-1 text-center">
              <p className="text-[8px] text-neutral-500 font-bold">
                {t.kanbanTodo || "Todo"}
              </p>
              <div className="mt-1 p-1 bg-neutral-800/20 rounded border border-neutral-800 text-[7px] text-neutral-400 truncate">
                Deploy API
              </div>
            </div>
            <div className="flex-1 border-r border-neutral-800/80 px-1 text-center">
              <p className="text-[8px] text-sky-500 font-bold">
                {t.kanbanProgress || "In Progress"}
              </p>
              <motion.div
                animate={{
                  x: activeClient ? [0, 4, 0] : 0,
                  borderColor: activeClient
                    ? ["#1f2937", "#3b82f6", "#1f2937"]
                    : "#1f2937",
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut",
                }}
                className="mt-1 p-1 bg-sky-500/5 rounded border border-neutral-800 text-[7px] text-sky-400 truncate font-semibold"
              >
                Auth Setup
              </motion.div>
            </div>
            <div className="flex-1 pl-1 text-center">
              <p className="text-[8px] text-emerald-500 font-bold">
                {t.kanbanDone || "Completed"}
              </p>
              <div className="mt-1 p-1 bg-emerald-500/5 rounded border border-neutral-800/50 text-[7px] text-emerald-400 line-through truncate opacity-40">
                Prisma Init
              </div>
            </div>
          </div>
        </BentoCard>
      </motion.div>

      {/* 3. Connected Rich Notes */}
      <motion.div variants={cardVariants} className="md:col-span-3 h-64">
        <BentoCard active={active}>
          <div className="flex flex-col md:flex-row gap-6 items-center h-full justify-between w-full">
            <div className={`flex-1 ${isRtl ? "text-right md:order-2" : ""}`}>
              <span className="text-[10px] font-black tracking-widest text-indigo-500 uppercase">
                Connected Notes
              </span>
              <h3 className="text-xl font-bold mt-2">
                {isRtl ? "یادداشت‌های متصل غنی" : "Connected Rich Notes"}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                {isRtl
                  ? t.bentoNotesDesc
                  : "Draft fluid text linked directly to tasks and clients with background saving."}
              </p>
            </div>

            <div
              dir="ltr"
              className="w-full md:w-80 bg-neutral-900/60 rounded-2xl p-4 border border-neutral-800/50 flex flex-col justify-between h-36 font-mono md:order-1"
            >
              <div className="flex justify-between items-center text-[8px] border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">
                  {t.notesDocTitle || "Briefing_Doc.md"}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-500/80">
                    {t.notesAutoSaving || "Auto-saving..."}
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-neutral-400 mt-2 leading-relaxed">
                &gt;{" "}
                {t.notesDocContent ||
                  "FreelanceOS enables integrated clients workflows, auto backup, and structured rich-text notes inside a unified console."}
              </p>
            </div>
          </div>
        </BentoCard>
      </motion.div>
    </motion.div>
  );
}
