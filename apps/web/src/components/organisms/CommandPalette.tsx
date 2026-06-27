"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, dir } = useApp();
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      setQuery("");
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { label: t.commandGoDashboard, path: "/dashboard" },
    { label: t.commandGoTasks, path: "/dashboard/tasks" },
    { label: t.commandGoProjects, path: "/dashboard/projects" },
    { label: t.commandGoClients, path: "/dashboard/clients" },
    { label: t.commandGoNotes, path: "/dashboard/notes" },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()),
  );

  const handleCommandClick = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        ref={containerRef}
        className="relative w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center gap-3">
          <Search className="h-4 w-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="grow bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
            placeholder={t.searchPlaceholder}
            autoFocus
          />
        </div>

        <div className="max-h-60 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <p className="text-xs text-neutral-400 p-4 text-center">
              {t.noCommands || "No commands found."}
            </p>
          ) : (
            <ul className="space-y-1">
              {filteredCommands.map((cmd) => (
                <li
                  key={cmd.path}
                  onClick={() => handleCommandClick(cmd.path)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between transition-colors",
                    dir === "rtl" ? "text-right" : "text-left",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {cmd.label}
                    </span>
                  </div>
                  <kbd className="text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                    Enter
                  </kbd>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
