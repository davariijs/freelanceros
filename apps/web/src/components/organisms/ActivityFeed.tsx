"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { ActivityLog } from "@/hooks/useActivityLogs";
import { formatDateStrict, toPersianDigits } from "@/utils/dateConverter";
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  PlusCircle,
  FolderPlus,
  Trophy,
  UserPlus,
} from "lucide-react";

interface ActivityFeedProps {
  activities: ActivityLog[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const { t, locale, dir } = useApp();
  const isJalali = locale === "fa";

  const truncateText = (text: string) => {
    return text.length > 30 ? `${text.substring(0, 30)}...` : text;
  };

  const getActionLabel = (action: string, metadataStr: string) => {
    const meta = JSON.parse(metadataStr || "{}");
    if (action === "TASK_CREATED") {
      const title = truncateText(meta.title || "");
      return t.activityTaskCreated
        ? t.activityTaskCreated.replace("{title}", title)
        : `Created Task: ${title}`;
    }
    if (action === "TASK_COMPLETED") {
      const title = truncateText(meta.title || "");
      return t.activityTaskCompleted
        ? t.activityTaskCompleted.replace("{title}", title)
        : `Completed Task: ${title}`;
    }
    if (action === "PROJECT_CREATED") {
      const title = truncateText(meta.title || "");
      return t.activityProjectCreated
        ? t.activityProjectCreated.replace("{title}", title)
        : `Started Project: ${title}`;
    }
    if (action === "PROJECT_COMPLETED") {
      const title = truncateText(meta.title || "");
      return t.activityProjectCompleted
        ? t.activityProjectCompleted.replace("{title}", title)
        : `Completed Project: ${title}`;
    }
    if (action === "CLIENT_CREATED") {
      const name = truncateText(meta.name || "");
      return t.activityClientCreated
        ? t.activityClientCreated.replace("{name}", name)
        : `Added Client: ${name}`;
    }
    return action;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "TASK_CREATED":
        return <PlusCircle className="h-4 w-4 text-blue-500" />;
      case "TASK_COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "PROJECT_CREATED":
        return <FolderPlus className="h-4 w-4 text-yellow-500" />;
      case "PROJECT_COMPLETED":
        return <Trophy className="h-4 w-4 text-amber-500" />;
      case "CLIENT_CREATED":
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      default:
        return <PlayCircle className="h-4 w-4 text-neutral-400" />;
    }
  };

  const formatActivityTime = (isoString: string) => {
    const date = new Date(isoString);
    const datePart = formatDateStrict(isoString, isJalali);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const timePart = `${hours}:${minutes}`;
    const formatted = `${datePart} - ${timePart}`;
    return isJalali ? toPersianDigits(formatted) : formatted;
  };

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
            className={`absolute top-1.5 bottom-1 w-px bg-neutral-200 dark:bg-neutral-800 ${dir === "rtl" ? "right-2.5" : "left-2.5"}`}
          />
          {activities.map((item) => (
            <li key={item.id} className="relative flex items-start gap-4">
              <div className="h-5 w-5 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center z-10 shrink-0">
                {getActionIcon(item.action)}
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                  {getActionLabel(item.action, item.metadata)}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  {formatActivityTime(item.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
