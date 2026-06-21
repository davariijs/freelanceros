"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Project } from "@/schemas/project";
import { Calendar, Info } from "lucide-react";

interface TimelineProps {
  projects: Project[];
}

export const Timeline: React.FC<TimelineProps> = ({ projects }) => {
  const { t, dir } = useApp();
  const [activeProject, setActiveProject] = React.useState<Project | null>(
    null,
  );

  const timelineWeeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

  return (
    <div className="space-y-6">
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {t.projectTimeline}
        </h2>

        {projects.length === 0 ? (
          <p className="text-sm text-neutral-400 py-6 text-center">
            {t.noProjects}
          </p>
        ) : (
          <div className="space-y-6 overflow-x-auto min-w-150">
            <div className="grid grid-cols-5 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs font-bold text-neutral-400">
              <div className="col-span-2">Projects</div>
              {timelineWeeks.map((week) => (
                <div key={week} className="text-center">
                  {week}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {projects.map((project, index) => {
                const startOffset =
                  index === 0
                    ? "col-start-3 col-span-2"
                    : "col-start-4 col-span-2";
                const progressWidth =
                  project.status === "COMPLETED" ? "w-full" : "w-2/3";

                return (
                  <div
                    key={project.id}
                    className="grid grid-cols-5 items-center gap-4"
                  >
                    <div className="col-span-2">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {project.title}
                      </span>
                    </div>
                    <div
                      onClick={() => setActiveProject(project)}
                      className={`h-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer p-1 relative flex items-center ${startOffset}`}
                    >
                      <div
                        className={`h-full rounded-lg bg-neutral-900 dark:bg-neutral-100 transition-all ${progressWidth}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
          <Info className="h-4 w-4" />
          {activeProject ? activeProject.title : t.clickProject}
        </h3>
        {activeProject ? (
          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <span className="text-neutral-400">{t.status}:</span>
              <strong className="block mt-1 text-neutral-900 dark:text-neutral-100">
                {activeProject.status}
              </strong>
            </div>
            <div>
              <span className="text-neutral-400">{t.client}:</span>
              <strong className="block mt-1 text-neutral-900 dark:text-neutral-100">
                Enterprise Client
              </strong>
            </div>
            <div>
              <span className="text-neutral-400">Deadline:</span>
              <strong className="block mt-1 text-neutral-900 dark:text-neutral-100">
                {activeProject.dueDate
                  ? new Date(activeProject.dueDate).toLocaleDateString()
                  : "No deadline"}
              </strong>
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            {t.clickProject}
          </p>
        )}
      </div>
    </div>
  );
};
