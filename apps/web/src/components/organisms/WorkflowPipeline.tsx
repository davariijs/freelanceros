"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Mail, ShieldAlert } from "lucide-react";

interface WorkflowPipelineProps {
  osState: number;
}

export function WorkflowPipeline({ osState }: WorkflowPipelineProps) {
  const { t, locale, theme } = useApp();
  const isRtl = locale === "fa";
  const isDark = theme === "dark";
  const active = osState === 3;

  const [clientActive, setClientActive] = React.useState(true);

  const containerVariants = {
    hidden: { opacity: 0, pointerEvents: "none" as const },
    visible: {
      opacity: 1,
      pointerEvents: "auto" as const,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 100, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 60, damping: 14 },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      className="w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 z-30 pointer-events-auto"
    >
      <motion.div
        variants={itemVariants}
        className={`p-6 rounded-3xl border backdrop-blur-2xl flex flex-col justify-between h-72 ${
          isDark
            ? "bg-[#09090e]/85 border-emerald-500/30 shadow-2xl text-white"
            : "bg-white/92 border-neutral-200/60 shadow-xl text-neutral-900"
        }`}
      >
        <div className={isRtl ? "text-right" : ""}>
          <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">
            Automation Console
          </span>
          <h3 className="text-xl font-bold mt-2">{t.pipelineClientLabel}</h3>
          <p
            className={`text-xs mt-2 leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
          >
            {isRtl
              ? "تغییر وضعیت فعال مشتری، پروژه‌ها را به صورت سیگنال‌های زنجیره‌ای تعلیق یا آزاد می‌کند."
              : "Toggle the client status to watch associated active projects dynamically cascade and transition states."}
          </p>
        </div>

        <div
          dir="ltr"
          className={`rounded-2xl p-3 border flex justify-between items-center text-xs ${isDark ? "bg-neutral-950/60 border-neutral-800" : "bg-neutral-50/50 border-neutral-200"}`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${clientActive ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" : "bg-neutral-500"}`}
            />
            <span className="font-bold text-[10px]">Acme Corp</span>
          </div>
          <button
            onClick={() => setClientActive(!clientActive)}
            className={`px-3 py-1.5 text-[9px] font-bold rounded-lg cursor-pointer border transition-all duration-300 ${
              clientActive
                ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
            }`}
          >
            {clientActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className={`md:col-span-2 p-6 rounded-3xl border backdrop-blur-2xl flex flex-col justify-between h-72 ${
          isDark
            ? "bg-[#09090e]/85 border-emerald-500/30 shadow-2xl text-white"
            : "bg-white/92 border-neutral-200/60 shadow-xl text-neutral-900"
        }`}
      >
        <div className={isRtl ? "text-right" : ""}>
          <span className="text-[10px] font-black tracking-widest text-sky-500 uppercase">
            Operations Conduits
          </span>
          <h3 className="text-xl font-bold mt-2">{t.pipelineProjectLabel}</h3>
        </div>

        <div className="flex-1 flex flex-col gap-3.5 justify-center my-4 relative">
          <motion.div
            layout
            className={`rounded-2xl p-3 border flex justify-between items-center relative transition-all duration-500 ${
              clientActive
                ? isDark
                  ? "bg-neutral-900/60 border-neutral-800"
                  : "bg-neutral-50/40 border-neutral-200 shadow-sm"
                : "border-amber-500/20 bg-amber-500/2"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${clientActive ? "bg-sky-500 animate-pulse" : "bg-amber-500 animate-pulse"}`}
              />
              <div>
                <p className="font-bold text-[10px]">{t.projectMobileUI}</p>
                <p className="text-[7.5px] text-neutral-500 mt-0.5">
                  Budget: $4,500 — Deadline in 3d
                </p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 text-[8px] font-bold rounded-md ${
                clientActive
                  ? "bg-sky-500/10 text-sky-400"
                  : "bg-amber-500/10 text-amber-500 animate-pulse"
              }`}
            >
              {clientActive ? t.pipelineProjectActive : t.pipelineProjectPaused}
            </span>
          </motion.div>
          <div
            className={`rounded-2xl p-3 border flex justify-between items-center relative ${
              isDark
                ? "bg-neutral-900/60 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.06)]"
                : "bg-neutral-50/40 border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.04)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
              <div>
                <p className="font-bold text-[10px] text-red-500 flex items-center gap-1">
                  <span>{t.projectPostgres}</span>
                  <ShieldAlert className="h-3 w-3" />
                </p>
                <p className="text-[7.5px] text-neutral-500 mt-0.5">
                  {t.pipelineMailSent}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              className="bg-red-500/10 text-red-400 p-1.5 rounded-md"
            >
              <Mail className="h-3.5 w-3.5" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
