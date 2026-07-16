"use client";

import * as React from "react";
import {
  Folder,
  CheckSquare,
  Users,
  FileText,
  Zap,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  type: "task" | "project" | "client" | "note" | "action";
  path?: string;
}

interface CommandPaletteMockItemProps {
  item: SearchItem;
  isFocused: boolean;
  dir: "ltr" | "rtl";
  onClick: () => void;
}

export const CommandPaletteMockItem: React.FC<CommandPaletteMockItemProps> = ({
  item,
  isFocused,
  dir,
  onClick,
}) => {
  const { t } = useApp();

  const getIcon = (type: SearchItem["type"]) => {
    const iconClass = `h-4 w-4 transition-transform duration-300 ${isFocused ? "scale-110 animate-bounce" : ""}`;
    switch (type) {
      case "task":
        return <CheckSquare className={`${iconClass} text-blue-500`} />;
      case "project":
        return <Folder className={`${iconClass} text-yellow-500`} />;
      case "client":
        return <Users className={`${iconClass} text-purple-500`} />;
      case "note":
        return <FileText className={`${iconClass} text-green-500`} />;
      case "action":
        return <Zap className={`${iconClass} text-amber-500`} />;
      default:
        return <Sparkles className={`${iconClass} text-neutral-400`} />;
    }
  };

  return (
    <motion.li
      onClick={onClick}
      animate={
        isFocused
          ? { scale: 1.015, x: dir === "rtl" ? -4 : 4 }
          : { scale: 1, x: 0 }
      }
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={cn(
        "px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-between transition-all select-none relative overflow-hidden group",
        dir === "rtl" ? "text-right" : "text-left",
        isFocused
          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-inner"
          : "text-neutral-500 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20",
      )}
    >
      <div className="flex items-center gap-3 min-w-0 z-10">
        <div className="shrink-0">{getIcon(item.type)}</div>
        <div className="truncate">
          <span className="text-neutral-900 dark:text-neutral-100 block truncate">
            {item.title}
          </span>
          {item.subtitle && (
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block truncate mt-0.5 font-normal">
              {item.subtitle}
            </span>
          )}
        </div>
      </div>

      <kbd
        className={cn(
          "text-[9px] font-mono rounded border shrink-0 w-14 h-5 flex items-center justify-center font-bold z-10 transition-colors duration-300",
          isFocused
            ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
            : "text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700",
        )}
      >
        {isFocused ? t.kbdEnter || "Enter" : t.kbdSelect || "Select"}
      </kbd>
    </motion.li>
  );
};
