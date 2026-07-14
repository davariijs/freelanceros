"use client";

import * as React from "react";
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
  const { dir } = useApp();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
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

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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
        </div>
      )}
    </div>
  );
};
