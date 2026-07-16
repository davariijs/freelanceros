"use client";

import * as React from "react";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Dialog } from "@/components/ui/Dialog";
import { FormField } from "@/components/ui/FormField";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select, SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { z } from "zod";
import {
  Project,
  ProjectStatus,
} from "@/features/projects/schemas/project.schema";
import { TaskPriority } from "@/features/tasks/schemas/task.schema";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Share2,
  Copy,
  ToggleLeft,
  ToggleRight,
  CalendarDays,
} from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const editProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["PLANNING", "ACTIVE", "COMPLETED", "PAUSED"]),
  clientId: z.string().optional(),
});

type EditProjectInput = z.infer<typeof editProjectSchema>;

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  clients?: { id: string; name: string }[];
  onUpdateProject: (
    id: string,
    data: {
      title: string;
      dueDate: string;
      priority: TaskPriority;
      status: ProjectStatus;
      clientId?: string;
    },
  ) => void;
  onDeleteProject: (id: string) => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  clients = [],
  onUpdateProject,
  onDeleteProject,
}) => {
  const { t, showToast, locale } = useApp();
  const router = useRouter();
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);
  const [isShared, setIsShared] = React.useState(false);
  const [shareToken, setShareToken] = React.useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProjectInput>({
    resolver: zodResolver(editProjectSchema),
  });

  const { field: dateField } = useController({ name: "dueDate", control });
  const { field: priorityField } = useController({ name: "priority", control });
  const { field: statusField } = useController({ name: "status", control });
  const { field: clientField } = useController({ name: "clientId", control });

  const formattedCreationDate = React.useMemo(() => {
    if (!project?.createdAt) return "";
    try {
      return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(project.createdAt));
    } catch {
      return project.createdAt;
    }
  }, [project?.createdAt, locale]);

  const priorityOptions: SelectOption[] = [
    { label: t.priorityLow, value: "LOW" },
    { label: t.priorityMedium, value: "MEDIUM" },
    { label: t.priorityHigh, value: "HIGH" },
  ];

  const statusOptions: SelectOption[] = [
    { label: t.statusPlanning, value: "PLANNING" },
    { label: t.statusActive, value: "ACTIVE" },
    { label: t.statusPaused, value: "PAUSED" },
    { label: t.statusCompleted, value: "COMPLETED" },
  ];

  const clientOptions: SelectOption[] = [
    { label: t.selectClient, value: "NONE" },
    ...clients.map((c) => ({ label: c.name, value: c.id })),
    { label: t.addClient, value: "REDIRECT" },
  ];

  const handleClientSelect = (value: string) => {
    if (value === "REDIRECT") {
      onClose();
      router.push("/dashboard/clients");
    } else {
      clientField.onChange(value);
    }
  };

  React.useEffect(() => {
    if (isOpen) setIsConfirmingDelete(false);
    if (project) {
      reset({
        title: project.title,
        dueDate: project.dueDate ? project.dueDate.split("T")[0] : "",
        priority: project.priority,
        status: project.status,
        clientId: project.clientId || "NONE",
      });
      setIsShared(project.isShared);
      setShareToken(project.shareToken ?? null);
    }
  }, [project, reset, isOpen]);

  if (!project) return null;

  const handleToggleShare = async () => {
    try {
      if (isShared) {
        await apiClient.post(`/projects/${project.id}/unshare`);
        setIsShared(false);
        setShareToken(null);
        showToast(t.shareDisabled || "Client portal link disabled", "success");
      } else {
        const res = await apiClient.post(`/projects/${project.id}/share`);
        setIsShared(true);
        setShareToken(res.data.shareToken);
        showToast(t.shareEnabled || "Client portal link generated", "success");
      }
    } catch (error) {
      showToast("Failed to update share settings", "error");
    }
  };

  const handleCopyLink = () => {
    if (shareToken) {
      const fullUrl = `${window.location.origin}/shared/${shareToken}`;
      navigator.clipboard.writeText(fullUrl);
      showToast(t.copiedSuccess || "Copied to clipboard!", "success");
    }
  };

  const onSubmit = (data: EditProjectInput) => {
    onUpdateProject(project.id, {
      title: data.title,
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
      clientId: data.clientId === "NONE" ? undefined : data.clientId,
    });
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t.editProject}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-h-[75vh] overflow-y-auto px-1 pb-4"
      >
        {formattedCreationDate && (
          <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 select-none">
            <div className="h-8 w-8 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0">
              <CalendarDays className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                {t.creationDate || "Created At"}
              </span>
              <span
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                dir="ltr"
              >
                {formattedCreationDate}
              </span>
            </div>
          </div>
        )}

        <FormField
          label={t.title}
          required
          errorMessage={errors.title ? t.titleRequired : undefined}
          {...register("title")}
        />

        <div className="flex flex-col gap-1.5">
          <DatePicker
            value={dateField.value}
            onChange={dateField.onChange}
            placeholder={t.placeholderProjectDate}
            required
          />
          {errors.dueDate && (
            <p role="alert" className="text-xs text-red-500 font-medium">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {t.priority}
            </label>
            <Select
              value={priorityField.value}
              onChange={priorityField.onChange}
              options={priorityOptions}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {t.status}
            </label>
            <Select
              value={statusField.value}
              onChange={statusField.onChange}
              options={statusOptions}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            {t.clients}
          </label>
          <Select
            value={clientField.value}
            onChange={handleClientSelect}
            options={clientOptions}
          />
        </div>

        <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Share2 className="h-4 w-4 text-emerald-500" />
              <span>{t.clientPortalTitle || "Client Share Portal"}</span>
            </label>
            <button
              type="button"
              onClick={handleToggleShare}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {isShared ? (
                <ToggleRight className="h-7 w-7 text-emerald-500" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-neutral-400" />
              )}
            </button>
          </div>

          {isShared && shareToken && (
            <div className="flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/shared/${shareToken}`}
                className="grow h-10 px-3 rounded-lg border bg-neutral-50/50 dark:bg-neutral-950/20 text-xs border-neutral-300 dark:border-neutral-800 focus:outline-none text-neutral-500 dark:text-neutral-400 select-all"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="h-10 w-10 p-0 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-center"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-6">
          {isConfirmingDelete ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50">
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {t.confirmDelete}
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 sm:flex-none"
                  onClick={() => setIsConfirmingDelete(false)}
                >
                  {t.cancel}
                </Button>
                <Button
                  type="button"
                  className="flex-1 sm:flex-none bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white border-transparent"
                  onClick={() => {
                    onDeleteProject(project.id);
                    onClose();
                  }}
                >
                  {t.delete}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="ghost"
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                onClick={() => setIsConfirmingDelete(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={onClose}>
                  {t.cancel}
                </Button>
                <Button type="submit">{t.save}</Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </Dialog>
  );
};
