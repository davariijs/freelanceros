"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { BentoCard } from "@/components/atoms/BentoCard";
import { useIsMobile } from "@/hooks/useIsMobile";

interface FeaturesGridProps {
  osState: 0 | 1 | 2 | 3 | 4 | 5;
}

export function FeaturesGrid({ osState }: FeaturesGridProps) {
  const { t, locale, theme } = useApp();
  const isRtl = locale === "fa";
  const isDark = theme === "dark";
  const [activeClient, setActiveClient] = React.useState(true);
  const isMobile = useIsMobile();

  const active = osState === 2;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  } as const;

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 120,
      scale: 0.95,
      filter: isMobile ? "none" : "blur(8px)",
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: isMobile ? "none" : "blur(0px)",

      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 pointer-events-auto px-6 md:px-8"
    >
      <motion.div variants={cardVariants} className="md:col-span-2 h-68">
        <BentoCard active={active} glowColor="rgba(16,185,129,0.18)">
          <div className={isRtl ? "text-right" : ""}>
            <span className="text-[10px] font-extrabold tracking-widest text-emerald-500 uppercase">
              CRM Engine
            </span>
            <h3 className="text-xl font-black mt-1.5">
              {isRtl ? "مدیریت پویای مشتریان" : "Active CRM Engine"}
            </h3>
            <p
              className={`text-xs mt-2 leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
            >
              {isRtl
                ? t.bentoCrmDesc
                : "Centralize client relationships. Deactivating a client automatically pauses all associated projects instantly."}
            </p>
          </div>

          <div
            className={`rounded-2xl p-3 border flex justify-between items-center text-xs mt-4 ${
              isDark
                ? "bg-neutral-900/60 border-neutral-800/60"
                : "bg-neutral-50/50 border-neutral-200/60 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2.5 w-2.5 rounded-full ${activeClient ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-neutral-400"}`}
              />
              <div>
                <p className="font-bold text-[10px]">Acme Corp</p>
                <p
                  className={`text-[8px] font-semibold mt-0.5 ${activeClient ? "text-emerald-500" : "text-neutral-500"}`}
                >
                  {activeClient
                    ? t.crmClientActive || "ACTIVE"
                    : t.crmClientInactive || "INACTIVE"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveClient(!activeClient)}
              className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer text-[9px] border transition-all duration-300 ${
                isDark
                  ? "bg-neutral-950 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-neutral-100"
                  : "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800 hover:text-neutral-950 shadow-sm"
              }`}
            >
              {activeClient ? "Deactivate" : "Activate"}
            </button>
          </div>
        </BentoCard>
      </motion.div>

      <motion.div variants={cardVariants} className="md:col-span-1 h-68">
        <BentoCard active={active} glowColor="rgba(56,189,248,0.18)">
          <div className={isRtl ? "text-right" : ""}>
            <span className="text-[10px] font-extrabold tracking-widest text-sky-500 uppercase">
              Kanban Board
            </span>
            <h3 className="text-xl font-black mt-1.5">
              {isRtl ? "بورد کانبان وظایف" : "Kanban Task Board"}
            </h3>
            <p
              className={`text-xs mt-2 leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
            >
              {isRtl
                ? t.bentoKanbanDesc
                : "Track tasks on an elegant board with responsive drag-and-drop mechanics."}
            </p>
          </div>

          <div className="flex gap-2 h-24 mt-4 select-none">
            <div
              className={`flex-1 rounded-xl p-1.5 border text-center flex flex-col justify-between ${isDark ? "bg-neutral-950/40 border-neutral-900" : "bg-white/40 border-neutral-200/50 shadow-sm"}`}
            >
              <p className="text-[7px] text-neutral-400 font-extrabold uppercase">
                {t.kanbanTodo || "Todo"}
              </p>
              <div
                className={`p-1 rounded text-[7px] font-semibold truncate ${isDark ? "bg-neutral-900 border border-neutral-800 text-neutral-400" : "bg-white border border-neutral-200 text-neutral-600 shadow-sm"}`}
              >
                Deploy API
              </div>
            </div>

            <div
              className={`flex-1 rounded-xl p-1.5 border text-center flex flex-col justify-between ${isDark ? "bg-neutral-950/40 border-neutral-900" : "bg-white/40 border-neutral-200/50 shadow-sm"}`}
            >
              <p className="text-[7px] text-sky-500 font-extrabold uppercase">
                {t.kanbanProgress || "In Progress"}
              </p>
              <motion.div
                animate={{
                  x: activeClient ? [0, 3, 0] : 0,
                  borderColor: activeClient
                    ? ["#1f2937", "#3b82f6", "#1f2937"]
                    : "#1f2937",
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut",
                }}
                className={`p-1 rounded text-[7px] font-extrabold truncate border ${isDark ? "bg-sky-500/10 text-sky-400 border-sky-900/50" : "bg-sky-50 text-sky-600 border-sky-200 shadow-sm"}`}
              >
                Auth Setup
              </motion.div>
            </div>

            <div
              className={`flex-1 rounded-xl p-1.5 border text-center flex flex-col justify-between ${isDark ? "bg-neutral-950/40 border-neutral-900" : "bg-white/40 border-neutral-200/50 shadow-sm"}`}
            >
              <p className="text-[7px] text-emerald-500 font-extrabold uppercase">
                {t.kanbanDone || "Completed"}
              </p>
              <div
                className={`p-1 rounded text-[7px] font-semibold line-through truncate opacity-40 border ${isDark ? "bg-emerald-950/20 text-emerald-400 border-neutral-800" : "bg-emerald-50/20 text-emerald-600 border-neutral-200"}`}
              >
                Prisma Init
              </div>
            </div>
          </div>
        </BentoCard>
      </motion.div>

      <motion.div variants={cardVariants} className="md:col-span-3 h-64">
        <BentoCard active={active} glowColor="rgba(99,102,241,0.18)">
          <div className="flex flex-col md:flex-row gap-6 items-center h-full justify-between w-full">
            <div className={`flex-1 ${isRtl ? "text-right md:order-2" : ""}`}>
              <span className="text-[10px] font-extrabold tracking-widest text-indigo-500 uppercase">
                Connected Notes
              </span>
              <h3 className="text-xl font-black mt-1.5">
                {isRtl ? "یادداشت‌های متصل غنی" : "Connected Rich Notes"}
              </h3>
              <p
                className={`text-xs mt-2 leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
              >
                {isRtl
                  ? t.bentoNotesDesc
                  : "Draft fluid text linked directly to tasks and clients with background saving."}
              </p>
            </div>

            <div
              className={`w-full md:w-80 rounded-2xl p-4 border flex flex-col justify-between h-36 font-mono md:order-1 ${
                isDark
                  ? "bg-[#0b0b10] border-neutral-800/80 shadow-2xl"
                  : "bg-[#fdfbf7] border-[#e4e1d9] shadow-md text-neutral-800"
              }`}
            >
              <div
                className={`flex justify-between items-center text-[8px] border-b pb-2 ${isDark ? "border-neutral-800" : "border-[#e4e1d9]"}`}
              >
                <span
                  className={isDark ? "text-neutral-400" : "text-neutral-600"}
                >
                  {t.notesDocTitle || "Briefing_Doc.md"}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                  <span
                    className={
                      isDark
                        ? "text-emerald-500/80"
                        : "text-emerald-600/90 font-bold"
                    }
                  >
                    {t.notesAutoSaving || "Auto-saving..."}
                  </span>
                </div>
              </div>
              <p
                className={`text-[9px] mt-2 leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
              >
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
