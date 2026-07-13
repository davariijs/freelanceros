"use client";

import { motion } from "framer-motion";
import { StatusDot } from "@/components/atoms/StatusDot";

interface SystemWidgetProps {
  active: boolean;
  activeColor: string;
  inactiveColor: string;
  activeTitle: string;
  inactiveTitle: string;
  activeValue: string;
  inactiveValue: string;
  className?: string;
}

export function SystemWidget({
  active,
  activeColor,
  inactiveColor,
  activeTitle,
  inactiveTitle,
  activeValue,
  inactiveValue,
  className = "",
}: SystemWidgetProps) {
  return (
    <div className={`fixed z-40 hidden md:block ${className}`}>
      <motion.div
        layout
        className="p-4 rounded-2xl border border-neutral-300/10 dark:border-emerald-500/30 bg-white/5 dark:bg-neutral-900/5 backdrop-blur-xl shadow-xl flex items-center gap-3"
      >
        <StatusDot
          active={active}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
        />
        <motion.div layout>
          <p className="text-[10px] font-black tracking-wider uppercase text-neutral-400">
            {active ? activeTitle : inactiveTitle}
          </p>
          <p className="text-xs font-semibold mt-0.5">
            {active ? activeValue : inactiveValue}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
