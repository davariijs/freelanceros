"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Select } from "@/components/atoms/Select";

interface FilterToolbarProps {
  onPriorityChange: (priority: string) => void;
  selectedPriority: string;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  onPriorityChange,
  selectedPriority,
}) => {
  const { t } = useApp();

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm">
      <div className="flex flex-col gap-1.5 min-w-50 w-full sm:w-auto">
        <label
          htmlFor="priority-filter"
          className="text-xs font-semibold text-neutral-500 dark:text-neutral-400"
        >
          {t.filterByPriority}
        </label>
        <Select
          id="priority-filter"
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="ALL">{t.all}</option>
          <option value="LOW">{t.priorityLow}</option>
          <option value="MEDIUM">{t.priorityMedium}</option>
          <option value="HIGH">{t.priorityHigh}</option>
        </Select>
      </div>
    </div>
  );
};
