"use client";

import { useEffect, useRef } from "react";

interface KeyboardShortcutsOptions {
  onCtrlK?: () => void;
  onJ?: () => void;
  onK?: () => void;
  onSpace?: () => void;
  onEnter?: () => void;
  onEsc?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions): void {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputActive =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.hasAttribute("contenteditable") ||
          activeElement.closest(".tiptap"));

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();
        optionsRef.current.onCtrlK?.();
        return;
      }

      if (isInputActive) {
        if (e.key === "Escape") {
          optionsRef.current.onEsc?.();
        }
        return;
      }

      switch (e.key) {
        case "j":
        case "J":
        case "ArrowDown":
          e.preventDefault();
          optionsRef.current.onJ?.();
          break;
        case "k":
        case "K":
        case "ArrowUp":
          e.preventDefault();
          optionsRef.current.onK?.();
          break;
        case " ":
          e.preventDefault();
          optionsRef.current.onSpace?.();
          break;
        case "Enter":
          if (
            activeElement?.tagName !== "BUTTON" &&
            activeElement?.tagName !== "A"
          ) {
            e.preventDefault();
            optionsRef.current.onEnter?.();
          }
          break;
        case "Escape":
          e.preventDefault();
          optionsRef.current.onEsc?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);
}
