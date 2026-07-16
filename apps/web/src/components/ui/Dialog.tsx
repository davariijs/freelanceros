"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200 md:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 max-md:hidden" onClick={onClose} />

      <div
        className={cn(
          "relative w-full max-w-md bg-white dark:bg-neutral-900 flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200",
          "md:rounded-2xl md:border md:border-neutral-200 md:dark:border-neutral-800 md:max-h-[85vh]",
          "max-md:fixed max-md:inset-0 max-md:w-screen max-md:h-dvh max-md:rounded-none max-md:border-none",
        )}
      >
        <div className="flex items-center justify-between p-4 md:p-6 shrink-0 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col w-full bg-white dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
};
