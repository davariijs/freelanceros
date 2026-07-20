"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
  dropdownHeightClass?: string;
}

export const Select: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
  className,
  dropdownHeightClass = "max-h-60",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const { dir } = useApp();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  React.useLayoutEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen, updatePosition]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);
      if (!clickedTrigger && !clickedMenu) setIsOpen(false);
    };

    const handleReposition = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isOpen, updatePosition]);

  return (
    <div className={cn("relative w-full", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400/50 text-neutral-900 dark:text-neutral-100 flex items-center justify-between transition-colors",
          isOpen && "border-neutral-400 dark:border-neutral-600",
        )}
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-neutral-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            className="z-9999 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <ul
              className={cn(
                "overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-700",
                dropdownHeightClass,
              )}
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "px-3 py-2.5 text-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center transition-colors",
                    dir === "rtl" ? "pl-8" : "pr-8",
                  )}
                >
                  <span
                    className={cn(
                      "flex-1 text-neutral-900 dark:text-neutral-100",
                      value === option.value && "font-bold",
                    )}
                  >
                    {option.label}
                  </span>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
                  )}
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
};
