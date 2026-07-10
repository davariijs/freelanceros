"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Search, Sparkles, Terminal } from "lucide-react";

interface CommandPaletteMockProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPaletteMock({
  isOpen,
  onClose,
}: CommandPaletteMockProps) {
  const { theme, t, locale } = useApp();
  const isDark = theme === "dark";
  const isRtl = locale === "fa";

  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const options = [
    { label: "Go to Projects Timeline", desc: "Instant jump", type: "nav" },
    { label: "Go to Clients Roster", desc: "Manage CRM", type: "nav" },
    { label: "Go to Notes Archive", desc: "Read connected notes", type: "nav" },
    {
      label: "> task [Title]",
      desc: "Create a new task in backlog",
      type: "cmd",
    },
    {
      label: "> project [Title]",
      desc: "Create a new project contract",
      type: "cmd",
    },
    {
      label: "> go [Project]",
      desc: "Jump to specific project page",
      type: "cmd",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 w-full h-screen bg-black/50 backdrop-blur-md z-50 flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-120 h-85 rounded-3xl border flex flex-col justify-between p-4 font-sans cursor-default ${
              isDark
                ? "bg-[#09090e]/95 border-neutral-800 text-white shadow-2xl"
                : "bg-white/95 border-neutral-200 shadow-2xl text-neutral-900"
            }`}
          >
            <div
              className={`flex items-center gap-3 border-b pb-3 ${isDark ? "border-neutral-800" : "border-neutral-200"}`}
            >
              <Search className="h-4 w-4 text-neutral-500" />
              <input
                type="text"
                readOnly
                placeholder="Search commands or type a shortcut..."
                className="bg-transparent border-none outline-none text-xs w-full text-neutral-400 font-mono"
              />
            </div>

            <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-1 pr-1">
              {options.map((opt, idx) => {
                const highlighted = idx === activeIndex;
                return (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                      highlighted
                        ? isDark
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-emerald-500/5 text-emerald-600"
                        : isDark
                          ? "text-neutral-400"
                          : "text-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {opt.type === "nav" ? (
                        <Sparkles
                          className={`h-3.5 w-3.5 ${highlighted ? "text-emerald-500" : "text-neutral-500"}`}
                        />
                      ) : (
                        <Terminal
                          className={`h-3.5 w-3.5 ${highlighted ? "text-emerald-500" : "text-neutral-500"}`}
                        />
                      )}
                      <div>
                        <p className="font-semibold">{opt.label}</p>
                        {highlighted && (
                          <p className="text-[9px] text-neutral-500 mt-0.5">
                            {opt.desc}
                          </p>
                        )}
                      </div>
                    </div>
                    {highlighted && (
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-500/10 text-emerald-600"}`}
                      >
                        Select
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              className={`flex justify-between items-center text-[10px] text-neutral-500 border-t pt-3 ${isDark ? "border-neutral-800" : "border-neutral-200"}`}
            >
              <span>Use Arrow keys to navigate</span>
              <span>Esc to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
