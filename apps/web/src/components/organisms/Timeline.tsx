"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Project } from "@/schemas/project";
import { Calendar, Clock, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateStrict } from "@/utils/dateConverter";

interface TimelineProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  projects,
  onProjectClick,
}) => {
  const { t, locale } = useApp();
  const isJalali = locale === "fa";

  const priorityColor = {
    LOW: "bg-green-500/10 text-green-500 border-green-500/20",
    MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    HIGH: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const getProgressWidth = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "w-full bg-green-500 dark:bg-green-400";
      case "ACTIVE":
        return "w-2/3 bg-neutral-900 dark:bg-neutral-100";
      case "PLANNING":
        return "w-1/4 bg-blue-500 dark:bg-blue-400";
      default:
        return "w-1/2 bg-neutral-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2 mb-6">
          <Calendar className="h-4 w-4" />
          {t.projectTimeline}
        </h2>

        {projects.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <p className="text-sm text-neutral-500">{t.noProjects}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const formattedDate = project.dueDate
                ? formatDateStrict(project.dueDate, isJalali)
                : "Ongoing";

              return (
                <div
                  key={project.id}
                  className="group p-3 -mx-3 rounded-xl transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate block max-w-50">
                        {project.title}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border",
                          priorityColor[project.priority],
                        )}
                      >
                        {project.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-neutral-500 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {formattedDate}
                      </span>
                      <button
                        type="button"
                        onClick={() => onProjectClick(project)}
                        className="h-7 w-7 rounded-full flex items-center justify-center transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
                        aria-label="Edit Project"
                      >
                        <Pencil className="h-3.5 w-3.5 text-neutral-900 dark:text-neutral-100" />
                      </button>
                    </div>
                  </div>

                  <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out",
                        getProgressWidth(project.status),
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
