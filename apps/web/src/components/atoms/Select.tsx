import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    const { dir } = useApp();

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "w-full h-11 px-3 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400/50 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-950 appearance-none cursor-pointer pr-10 pl-3",
            dir === "rtl" ? "pl-10 pr-3" : "pr-10 pl-3",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 ${dir === "rtl" ? "left-3" : "right-3"}`}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";
