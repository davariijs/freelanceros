import * as React from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        "p-6 h-40 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm",
        "transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md dark:hover:shadow-neutral-900/30",
        "grid grid-rows-[auto_1fr_auto]",
        className,
      )}
    >
      <div>
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          {title}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          {value}
        </h3>
        {icon && (
          <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800/50 flex items-center justify-center text-neutral-500 dark:text-neutral-400 shrink-0 transition-colors duration-300 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800">
            {icon}
          </div>
        )}
      </div>

      <div>
        {description && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
