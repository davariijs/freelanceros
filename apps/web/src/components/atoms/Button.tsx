import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-neutral-100 text-neutral-950 hover:bg-neutral-200 dark:bg-neutral-100 dark:text-neutral-950":
              variant === "primary",
            "border border-neutral-300 dark:border-neutral-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900":
              variant === "secondary",
            "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900":
              variant === "ghost",
            "h-9 px-3 text-sm": size === "sm",
            "h-11 px-4 text-base": size === "md",
            "h-12 px-6 text-lg": size === "lg",
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
