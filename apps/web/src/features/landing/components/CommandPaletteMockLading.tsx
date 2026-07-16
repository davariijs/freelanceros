"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Search, ArrowLeft } from "lucide-react";
import {
  CommandPaletteMockItem,
  SearchItem,
} from "@/features/landing/components/CommandPaletteMockItem";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

interface CommandPaletteMockProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPaletteMockLanding({
  isOpen,
  onClose,
}: CommandPaletteMockProps) {
  const { t, dir, locale } = useApp();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isAutoDemo, setIsPaletteDemo] = React.useState(true);
  const [successIndex, setSuccessIndex] = React.useState<number | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  useClickOutside(containerRef, onClose);

  const defaultItems: SearchItem[] = React.useMemo(
    () => [
      {
        id: "p1",
        title: t.cmdProjectsTitle || "Go to Projects Timeline",
        subtitle: t.cmdProjectsSubtitle || "Jump to Gantt chart",
        type: "project",
      },
      {
        id: "p2",
        title: t.cmdClientsTitle || "Go to Clients Roster",
        subtitle: t.cmdClientsSubtitle || "Manage your active CRM",
        type: "client",
      },
      {
        id: "p3",
        title: t.cmdNotesTitle || "Go to Notes Archive",
        subtitle: t.cmdNotesSubtitle || "Draft connected rich notes",
        type: "note",
      },
      {
        id: "p4",
        title: t.cmdTaskTitle || "> task [Title]",
        subtitle: t.cmdTaskSubtitle || "Instantly create a new task in backlog",
        type: "task",
      },
      {
        id: "p5",
        title: t.cmdProjectTitle || "> project [Title]",
        subtitle:
          t.cmdProjectSubtitle || "Instantly create a new project contract",
        type: "project",
      },
      {
        id: "p6",
        title: t.cmdGoTitle || "> go [Project]",
        subtitle:
          t.cmdGoSubtitle || "Instantly jump to a specific project page",
        type: "action",
      },
    ],
    [t],
  );

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return defaultItems;
    return defaultItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.subtitle &&
          item.subtitle.toLowerCase().includes(query.toLowerCase())),
    );
  }, [query, defaultItems]);

  React.useEffect(() => {
    if (!isOpen || !isAutoDemo) return;

    const typingSequence = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      while (isAutoDemo) {
        setSelectedIndex(0);
        setQuery("");
        await wait(900);
        if (!isAutoDemo) break;

        setSelectedIndex(1);
        await wait(900);
        if (!isAutoDemo) break;

        setSelectedIndex(2);
        await wait(900);
        if (!isAutoDemo) break;

        const typeTarget = "task";
        for (let i = 1; i <= typeTarget.length; i++) {
          setQuery(typeTarget.substring(0, i));
          await wait(50);
        }
        setSelectedIndex(3);
        await wait(1000);
        if (!isAutoDemo) break;

        setQuery("");
        setSelectedIndex(0);
        await wait(600);
      }
    };

    typingSequence();
  }, [isOpen, isAutoDemo]);

  const handleItemClick = (index: number) => {
    setSuccessIndex(index);
    setTimeout(() => {
      setSuccessIndex(null);
      onClose();
    }, 220);
  };

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      setIsPaletteDemo(false);

      if (e.key === "ArrowDown" || e.key === "j" || e.key === "J") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp" || e.key === "k" || e.key === "K") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredItems.length) % filteredItems.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleItemClick(selectedIndex);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [filteredItems, selectedIndex, onClose],
  );

  const handleKeyDownRef = React.useRef(handleKeyDown);
  React.useEffect(() => {
    handleKeyDownRef.current = handleKeyDown;
  });

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;

    const globalListener = (e: KeyboardEvent) => {
      handleKeyDownRef.current(e);
    };

    window.addEventListener("keydown", globalListener, true);
    return () => {
      window.removeEventListener("keydown", globalListener, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navigationGuide = t.cmdNavigationGuide || "Use Arrow keys to navigate";

  return (
    <div className="fixed inset-0 w-full h-screen flex items-start justify-center pt-[15vh] p-4 bg-neutral-950/70 backdrop-blur-md transition-all duration-300 z-100 animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        ref={containerRef}
        className={cn(
          "relative w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden transition-transform duration-300 animate-in zoom-in-95 pointer-events-auto",
          "max-md:fixed max-md:inset-0 max-md:h-screen max-md:w-screen max-md:rounded-none max-md:border-none max-md:flex max-md:flex-col",
        )}
      >
        <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="md:hidden h-10 w-10 -ms-2 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 active:scale-90 transition-transform cursor-pointer shrink-0"
            aria-label="Back"
          >
            <ArrowLeft
              className={cn("h-5 w-5", dir === "rtl" && "rotate-180")}
            />
          </button>

          <Search className="h-4 w-4 text-neutral-400 shrink-0 max-md:hidden" />

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setIsPaletteDemo(false);
              setQuery(e.target.value);
            }}
            className="grow bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 h-full font-mono"
            placeholder={t.cmdSearchPlaceholder || "Search..."}
            autoFocus
          />
        </div>

        <div className="max-h-72 overflow-y-auto p-2 grow max-md:max-h-none">
          {filteredItems.length === 0 ? (
            <p className="text-xs text-neutral-400 p-6 text-center">
              {t.cmdNoResults || "No commands found."}
            </p>
          ) : (
            <ul ref={listRef} className="space-y-0.5">
              {filteredItems.map((item, index) => {
                const isSuccess = index === successIndex;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "transition-all duration-200 rounded-xl",
                      isSuccess &&
                        "bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
                    )}
                  >
                    <CommandPaletteMockItem
                      item={item}
                      isFocused={index === selectedIndex || isSuccess}
                      dir={dir}
                      onClick={() => handleItemClick(index)}
                    />
                  </div>
                );
              })}
            </ul>
          )}
        </div>

        <div className="h-8 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-4 flex items-center justify-between text-[10px] text-neutral-400 font-medium shrink-0 max-md:hidden">
          <div>{navigationGuide}</div>
          <div>{t.cmdEscClose || "Esc to close"}</div>
        </div>
      </div>
    </div>
  );
}
