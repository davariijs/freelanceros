"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
import {
  FolderGit2,
  ShieldAlert,
  CheckCircle,
  Clock,
  KanbanSquare,
  Eye,
  Globe,
  Sun,
  Moon,
  Calendar,
} from "lucide-react";

interface SharedTask {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
}

interface SharedProject {
  id: string;
  title: string;
  description?: string;
  isShared: boolean;
  tasks: SharedTask[];
  createdAt: string;
}

export function SharedProjectPortal({ shareToken }: { shareToken: string }) {
  const [selectedTask, setSelectedTask] = React.useState<SharedTask | null>(
    null,
  );
  const { toggleLocale, setTheme, theme, locale, t } = useApp();
  const isRtl = locale === "fa";

  const {
    data: project,
    isLoading,
    error,
  } = useQuery<SharedProject>({
    queryKey: ["shared-project", shareToken],
    queryFn: async () => {
      const res = await apiClient.get(`/shared/projects/${shareToken}`);
      return res.data;
    },
    refetchInterval: 5000,
    retry: false,
  });

  const formatDateTime = React.useCallback(
    (isoString?: string) => {
      if (!isoString) return "";
      try {
        return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
          dateStyle: "long",
          timeStyle: "short",
        }).format(new Date(isoString));
      } catch {
        return isoString;
      }
    },
    [locale],
  );

  const parseMarkdown = (text: string) => {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-lg font-bold my-2 text-neutral-900 dark:text-white">$1</h1>',
    );
    html = html.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-extrabold text-neutral-950 dark:text-white">$1</strong>',
    );
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(
      /`(.*?)`/g,
      '<code class="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-xs font-mono text-neutral-900 dark:text-neutral-100">$1</code>',
    );
    html = html.replace(/\n/g, "<br />");
    return html;
  };

  const stripMarkdown = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/^#\s+(.*$)/gim, "$1")
      .replace(/\n/g, " ");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-emerald-500/10 border-t-emerald-500 animate-spin" />
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase animate-pulse">
            {t.sharedLoadingPortal || "Loading Portal..."}
          </span>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-md w-full text-center space-y-4 border border-red-500/10 bg-red-500/5 p-8 rounded-3xl backdrop-blur-sm">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-2 text-red-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {t.sharedLinkExpiredTitle || "Link Expired or Disabled"}
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.sharedLinkExpiredDesc ||
              "The workspace share link you are trying to access has been deactivated by the administrator or doesn't exist anymore."}
          </p>
        </div>
      </main>
    );
  }

  const columns: {
    id: "TODO" | "IN_PROGRESS" | "DONE";
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    color: string;
  }[] = [
    {
      id: "TODO",
      title: t.todo || "To Do",
      icon: Clock,
      color: "bg-neutral-100/60 dark:bg-neutral-900/50",
    },
    {
      id: "IN_PROGRESS",
      title: t.inProgress || "In Progress",
      icon: KanbanSquare,
      color:
        "bg-sky-500/5 dark:bg-sky-950/10 border-sky-500/10 dark:border-sky-900/20",
    },
    {
      id: "DONE",
      title: t.done || "Completed",
      icon: CheckCircle,
      color:
        "bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/10 dark:border-emerald-900/20",
    },
  ];

  const getPriorityColor = (priority: "LOW" | "MEDIUM" | "HIGH") => {
    if (priority === "LOW")
      return "bg-green-500/10 text-green-500 border-green-500/20";
    if (priority === "MEDIUM")
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  const activeLanguageLabel = locale === "en" ? "EN" : "فا";

  return (
    <main className="min-h-screen p-6 md:p-12 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8 relative">
        <div className="absolute top-0 md:-top-8 right-0 flex items-center gap-1 p-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm z-50">
          <Button
            onClick={toggleLocale}
            variant="ghost"
            size="sm"
            className="h-8 px-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center gap-2"
          >
            <Globe className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
            <span className="text-xs font-semibold">{activeLanguageLabel}</span>
          </Button>
          <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800" />
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center"
          >
            {theme === "dark" ? (
              <Moon className="h-3.5 w-3.5 text-neutral-400" />
            ) : (
              <Sun className="h-3.5 w-3.5 text-yellow-500" />
            )}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 gap-4 pt-12 md:pt-4">
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-extrabold text-emerald-500 tracking-widest uppercase flex items-center gap-1.5">
              <FolderGit2 className="h-4 w-4" />
              <span>
                {isRtl
                  ? "پورتال کارفرما — فقط خواندنی"
                  : "CLIENT PORTAL — READ ONLY"}
              </span>
            </span>
            <h1 className="text-3xl font-black tracking-tight">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xl">
                {project.description}
              </p>
            )}

            {project.createdAt && (
              <div
                className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 pt-1"
                dir={isRtl ? "rtl" : "ltr"}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {t.creationDate || "Created At"}:{" "}
                  {formatDateTime(project.createdAt)}
                </span>
              </div>
            )}
          </div>
          <span className="px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-extrabold uppercase tracking-widest self-start md:self-center">
            {isRtl ? "لینک کارفرما فعال" : "Client Portal Live"}
          </span>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start"
          dir="ltr"
        >
          {columns.map((col) => {
            const columnTasks = project.tasks.filter(
              (t) => t.status === col.id,
            );
            const Icon = col.icon;
            return (
              <div
                key={col.id}
                className={cn(
                  "rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 min-h-125 max-h-150 md:max-h-187.5 h-full flex flex-col gap-4",
                  col.color,
                )}
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-neutral-400" />
                    <span>{col.title}</span>
                  </h3>
                  <span className="text-[10px] font-extrabold bg-neutral-200 dark:bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {columnTasks.length === 0 ? (
                    <div className="grow flex items-center justify-center p-8 border border-dashed border-neutral-200 dark:border-neutral-800/80 rounded-xl">
                      <p className="text-xs text-neutral-400">
                        {t.sharedNoTasksColumn || "No tasks in this column"}
                      </p>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm cursor-pointer select-none transition-all duration-200 group relative"
                      >
                        <div className="flex flex-col gap-3 text-left">
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                "text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border",
                                getPriorityColor(task.priority),
                              )}
                            >
                              {task.priority}
                            </span>
                            <Eye className="h-3.5 w-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
                              {stripMarkdown(task.description)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={t.sharedTaskInspection || "Task Inspection"}
      >
        {selectedTask && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <span
                className={cn(
                  "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border",
                  getPriorityColor(selectedTask.priority),
                )}
              >
                {selectedTask.priority}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                {t.sharedStatus || "Status"}: {selectedTask.status}
              </span>
            </div>

            {selectedTask.createdAt && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 select-none">
                <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    {t.creationDate || "Created At"}
                  </span>
                  <span
                    className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                    dir="ltr"
                  >
                    {formatDateTime(selectedTask.createdAt)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                {t.sharedTaskTitle || "Task Title"}
              </label>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {selectedTask.title}
              </h2>
            </div>
            <div className="space-y-1 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                {t.sharedTaskDesc || "Task Description"}
              </label>
              {selectedTask.description ? (
                <div
                  className="prose dark:prose-invert text-xs leading-relaxed whitespace-pre-wrap text-neutral-700 dark:text-neutral-300 max-h-60 overflow-y-auto"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdown(selectedTask.description),
                  }}
                />
              ) : (
                <p className="text-xs text-neutral-400 italic">
                  {t.sharedNoDesc || "No description provided for this task."}
                </p>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </main>
  );
}
