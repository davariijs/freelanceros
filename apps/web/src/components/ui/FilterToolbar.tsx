"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Select, SelectOption } from "@/components/ui/Select";

interface FilterToolbarProps {
  filters: { priority: string; client: string; status: string };
  onFilterChange: (key: string, value: string) => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onFilterChange,
}) => {
  const { t } = useApp();

  const priorityOptions: SelectOption[] = [
    { label: t.all, value: "ALL" },
    { label: t.priorityLow, value: "LOW" },
    { label: t.priorityMedium, value: "MEDIUM" },
    { label: t.priorityHigh, value: "HIGH" },
  ];

  const statusOptions: SelectOption[] = [
    { label: t.all, value: "ALL" },
    { label: t.statusPlanning, value: "PLANNING" },
    { label: t.statusActive, value: "ACTIVE" },
    { label: t.statusPaused, value: "PAUSED" },
    { label: t.statusCompleted, value: "COMPLETED" },
  ];

  return (
    <div className="flex flex-wrap gap-4 items-end p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm">
      <div className="flex flex-col gap-2 w-full sm:w-48">
        <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          {t.filterByPriority}
        </label>
        <Select
          value={filters.priority}
          options={priorityOptions}
          onChange={(val) => onFilterChange("priority", val)}
        />
      </div>

      <div className="flex flex-col gap-2 w-full sm:w-48">
        <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          {t.status}
        </label>
        <Select
          value={filters.status}
          options={statusOptions}
          onChange={(val) => onFilterChange("status", val)}
        />
      </div>
    </div>
  );
};
