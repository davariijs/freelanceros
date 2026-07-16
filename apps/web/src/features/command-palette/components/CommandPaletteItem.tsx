"use client";

import * as React from "react";
import { SearchItem } from "@/features/command-palette/hooks/useCommandPaletteData";
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

interface CommandPaletteItemProps {
  item: SearchItem;
  isFocused: boolean;
  dir: "ltr" | "rtl";
  onClick: () => void;
}

export const CommandPaletteItem: React.FC<CommandPaletteItemProps> = ({
  item,
  isFocused,
  dir,
  onClick,
}) => {
  const { t } = useApp();

  const getIcon = (type: SearchItem["type"]) => {
    switch (type) {
      case "task":
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case "project":
        return <Folder className="h-4 w-4 text-yellow-500" />;
      case "client":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "note":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "action":
        return <Zap className="h-4 w-4 text-amber-500 animate-pulse" />;
      default:
        return <Sparkles className="h-4 w-4 text-neutral-400" />;
    }
  };

  return (
    <li
      onClick={onClick}
      className={cn(
        "px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-between transition-all",
        dir === "rtl" ? "text-right" : "text-left",
        isFocused
          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-inner"
          : "text-neutral-500 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
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

      <kbd className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800/80 rounded border border-neutral-200 dark:border-neutral-700 shrink-0 w-14 h-5 flex items-center justify-center font-bold">
        {isFocused ? t.kbdEnter : t.kbdSelect}
      </kbd>
    </li>
  );
};
