"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { useTasksQuery, useCreateTaskMutation } from "@/hooks/useTasks";
import {
  useProjectsQuery,
  useCreateProjectMutation,
} from "@/hooks/useProjects";
import { useClientsQuery } from "@/hooks/useClients";
import { useNotesQuery } from "@/hooks/useNotes";
import Fuse from "fuse.js";

export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  type: "task" | "project" | "client" | "note" | "navigation" | "action";
  path?: string;
  handler?: () => void;
}

interface UseCommandPaletteDataProps {
  query: string;
  setQuery: (q: string) => void;
  onClose: () => void;
}

export function useCommandPaletteData({
  query,
  setQuery,
  onClose,
}: UseCommandPaletteDataProps) {
  const { t, showToast } = useApp();

  const { data: tasks = [] } = useTasksQuery();
  const { data: projects = [] } = useProjectsQuery();
  const { data: clients = [] } = useClientsQuery();
  const { data: notes = [] } = useNotesQuery();

  const createTaskMutation = useCreateTaskMutation();
  const createProjectMutation = useCreateProjectMutation();

  const searchItems = React.useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [
      {
        id: "nav-dash",
        title: t.commandGoDashboard || "Go to Dashboard",
        type: "navigation",
        path: "/dashboard",
      },
      {
        id: "nav-tasks",
        title: t.commandGoTasks || "Go to Tasks Board",
        type: "navigation",
        path: "/dashboard/tasks",
      },
      {
        id: "nav-projects",
        title: t.commandGoProjects || "Go to Projects Timeline",
        type: "navigation",
        path: "/dashboard/projects",
      },
      {
        id: "nav-clients",
        title: t.commandGoClients || "Go to Clients Roster",
        type: "navigation",
        path: "/dashboard/clients",
      },
      {
        id: "nav-notes",
        title: t.commandGoNotes || "Go to Notes Archive",
        type: "navigation",
        path: "/dashboard/notes",
      },

      {
        id: "help-task",
        title: t.commandTaskHelpTitle,
        subtitle: t.commandTaskHelpDesc,
        type: "action",
        handler: () => setQuery("> task "),
      },
      {
        id: "help-project",
        title: t.commandProjectHelpTitle,
        subtitle: t.commandProjectHelpDesc,
        type: "action",
        handler: () => setQuery("> project "),
      },
      {
        id: "help-go",
        title: t.commandGoHelpTitle,
        subtitle: t.commandGoHelpDesc,
        type: "action",
        handler: () => setQuery("> go "),
      },
    ];

    tasks.forEach((task) => {
      if (task?.title) {
        items.push({
          id: `task-${task.id}`,
          title: task.title,
          subtitle: `${t.commandTasksSubtitle || "Tasks"} | Priority: ${task.priority || "MEDIUM"}`,
          type: "task",
          path: "/dashboard/tasks",
        });
      }
    });

    projects.forEach((proj) => {
      if (proj?.title) {
        items.push({
          id: `proj-${proj.id}`,
          title: proj.title,
          subtitle: `${t.commandProjectsSubtitle || "Projects"} | Status: ${proj.status || "PLANNING"}`,
          type: "project",
          path: "/dashboard/projects",
        });
      }
    });

    clients.forEach((c) => {
      if (c?.name) {
        items.push({
          id: `client-${c.id}`,
          title: c.name,
          subtitle: `${t.commandClientsSubtitle || "Clients"} | ${c.email || ""}`,
          type: "client",
          path: "/dashboard/clients",
        });
      }
    });

    notes.forEach((n) => {
      items.push({
        id: `note-${n.id}`,
        title: n.title || "Untitled Note",
        subtitle: t.commandNotesSubtitle || "Notes",
        type: "note",
        path: "/dashboard/notes",
      });
    });

    return items;
  }, [tasks, projects, clients, notes, t, setQuery]);

  const parsedItems = React.useMemo<SearchItem[]>(() => {
    const trimmed = query.trim();

    if (trimmed.startsWith(">")) {
      const commandParts = trimmed.substring(1).trim().split(" ");
      const mainCommand = commandParts[0].toLowerCase();
      const payload = commandParts.slice(1).join(" ");

      if (mainCommand === "task") {
        return [
          {
            id: "cmd-create-task",
            title: payload
              ? t.commandCreateTaskWithPayload.replace("{payload}", payload)
              : t.commandCreateTaskPlaceholder,
            subtitle: t.commandCreateTaskSubtitle,
            type: "action",
            handler: () => {
              if (payload) {
                createTaskMutation.mutate(
                  {
                    title: payload,
                    description: "",
                    priority: "MEDIUM",
                    status: "TODO",
                  },
                  {
                    onSuccess: () => {
                      showToast(t.toastTaskCreated, "success");
                    },
                    onError: (err: any) => {
                      showToast(
                        err?.response?.data?.message ||
                          err.message ||
                          "Failed to create task",
                        "error",
                      );
                    },
                  },
                );
                onClose();
              }
            },
          },
        ];
      }

      if (mainCommand === "project") {
        return [
          {
            id: "cmd-create-project",
            title: payload
              ? t.commandCreateProjectWithPayload.replace("{payload}", payload)
              : t.commandCreateProjectPlaceholder,
            subtitle: t.commandCreateProjectSubtitle,
            type: "action",
            handler: () => {
              if (payload) {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                createProjectMutation.mutate(
                  {
                    title: payload,
                    dueDate: nextWeek.toISOString().split("T")[0],
                    priority: "MEDIUM",
                    status: "PLANNING",
                  },
                  {
                    onSuccess: () => {
                      showToast(t.toastProjectCreated, "success");
                    },
                    onError: (err: any) => {
                      showToast(
                        err?.response?.data?.message ||
                          err.message ||
                          "Failed to create project",
                        "error",
                      );
                    },
                  },
                );
                onClose();
              }
            },
          },
        ];
      }

      if (mainCommand === "go" && payload) {
        const matches = projects.filter((p) =>
          p.title.toLowerCase().includes(payload.toLowerCase()),
        );
        return matches.map((p) => ({
          id: `go-${p.id}`,
          title: t.commandGoProjectWithPayload.replace("{title}", p.title),
          type: "navigation",
          path: "/dashboard/projects",
        }));
      }
    }

    if (!trimmed) {
      return searchItems.filter(
        (i) => i.type === "navigation" || i.id.startsWith("help-"),
      );
    }

    const searchTarget = trimmed.toLowerCase();

    try {
      if (typeof Fuse === "function") {
        const fuse = new Fuse(searchItems, {
          keys: ["title", "subtitle"],
          threshold: 0.4,
        });
        return fuse.search(searchTarget).map((res) => res.item);
      }
      throw new Error("Fuse fallback");
    } catch {
      return searchItems.filter((item) => {
        const titleStr = String(item.title || "").toLowerCase();
        const subtitleStr = String(item.subtitle || "").toLowerCase();
        return (
          titleStr.includes(searchTarget) || subtitleStr.includes(searchTarget)
        );
      });
    }
  }, [
    query,
    searchItems,
    projects,
    createTaskMutation,
    createProjectMutation,
    onClose,
    t,
    showToast,
  ]);

  return { parsedItems };
}
