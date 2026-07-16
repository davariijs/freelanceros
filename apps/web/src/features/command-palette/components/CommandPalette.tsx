"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Search, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCommandPaletteData } from "@/features/command-palette/hooks/useCommandPaletteData";
import { CommandPaletteItem } from "@/features/command-palette/components/CommandPaletteItem";
import { useClickOutside } from "@/hooks/useClickOutside";
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
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const { parsedItems } = useCommandPaletteData({ query, setQuery, onClose });

  useClickOutside(containerRef, onClose);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  React.useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputActive =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.hasAttribute("contenteditable"));

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % parsedItems.length);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + parsedItems.length) % parsedItems.length,
        );
        return;
      }

      if (!isInputActive) {
        if (e.key === "j" || e.key === "J") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % parsedItems.length);
          return;
        }
        if (e.key === "k" || e.key === "K") {
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + parsedItems.length) % parsedItems.length,
          );
          return;
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const activeItem = parsedItems[selectedIndex];
        if (activeItem) {
          if (activeItem.handler) {
            activeItem.handler();
          } else if (activeItem.path) {
            router.push(activeItem.path);
            onClose();
          }
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [parsedItems, selectedIndex, router, onClose],
  );

  const handleKeyDownRef = React.useRef(handleKeyDown);
  React.useEffect(() => {
    handleKeyDownRef.current = handleKeyDown;
  });

  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
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

  const handleItemClick = (handler?: () => void, path?: string) => {
    if (handler) handler();
    else if (path) {
      router.push(path);
      onClose();
    }
  };

  const navigationGuide = t.useJKNavigate
    .replace("{j}", "J")
    .replace("{k}", "K");

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] p-4 bg-neutral-950/70 backdrop-blur-md transition-all duration-300 max-md:p-0 max-md:pt-0 max-md:items-stretch animate-in fade-in">
      <div className="absolute inset-0 max-md:hidden" onClick={onClose} />

      <div
        ref={containerRef}
        className={cn(
          "relative w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden transition-transform duration-300 animate-in zoom-in-95",
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
            onChange={(e) => setQuery(e.target.value)}
            className="grow bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 h-full"
            placeholder={t.searchPlaceholder || "Search..."}
            autoFocus
          />
        </div>

        <div className="max-h-72 overflow-y-auto p-2 grow max-md:max-h-none">
          {parsedItems.length === 0 ? (
            <p className="text-xs text-neutral-400 p-6 text-center">
              {t.noCommands || "No commands or documents found."}
            </p>
          ) : (
            <ul ref={listRef} className="space-y-0.5">
              {parsedItems.map((item, index) => (
                <CommandPaletteItem
                  key={item.id}
                  item={item}
                  isFocused={index === selectedIndex}
                  dir={dir}
                  onClick={() => handleItemClick(item.handler, item.path)}
                />
              ))}
            </ul>
          )}
        </div>

        <div className="h-8 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-4 flex items-center justify-between text-[10px] text-neutral-400 font-medium shrink-0 max-md:hidden">
          <div>{navigationGuide}</div>
          <div>{t.escToClose}</div>
        </div>
      </div>
    </div>
  );
};
