"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  metadata: string;
  createdAt: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const { t, dir } = useApp();

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-6 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        {t.recentActivity}
      </h2>
      {activities.length === 0 ? (
        <p className="text-sm text-neutral-400 py-4 text-center">{t.noLogs}</p>
      ) : (
        <ul className="space-y-4 relative">
          <div
            className={`absolute top-1.5 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800 ${dir === "rtl" ? "right-2" : "left-2"}`}
          />
          {activities.map((item) => {
            const parsedMeta = JSON.parse(item.metadata || "{}");
            return (
              <li key={item.id} className="relative flex items-start gap-4">
                <div className="h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-500 mt-1.5 ml-1 shrink-0 z-10" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                    {item.action === "TASK_CREATED"
                      ? `Created Task: ${parsedMeta.title}`
                      : item.action}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
