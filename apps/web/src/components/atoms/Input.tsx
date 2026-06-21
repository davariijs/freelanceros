import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-11 px-3 rounded-lg border bg-transparent text-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500 focus:ring-red-500/50"
            : "border-neutral-300 dark:border-neutral-800 focus:ring-neutral-400/50",
          className,
        )}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
