"use client";

import * as React from "react";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Dialog } from "@/components/ui/Dialog";
import { FormField } from "@/components/ui/FormField";
import { Select, SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { z } from "zod";
import { Task, TaskPriority } from "@/features/tasks/schemas/task.schema";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";

const editTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  projectId: z.string().optional(),
});

type EditTaskInput = z.infer<typeof editTaskSchema>;

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  projects: { id: string; title: string }[];
  onUpdateTask: (
    id: string,
    data: {
      title: string;
      description: string;
      priority: TaskPriority;
      projectId?: string;
    },
  ) => void;
  onDeleteTask: (id: string) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  projects,
  onUpdateTask,
  onDeleteTask,
}) => {
  const { t, locale } = useApp();
  const router = useRouter();
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTaskInput>({
    resolver: zodResolver(editTaskSchema),
  });

  const { field: priorityField } = useController({ name: "priority", control });
  const { field: projectField } = useController({ name: "projectId", control });
  const { field: descriptionField } = useController({
    name: "description",
    control,
  });

  const formattedCreationDate = React.useMemo(() => {
    const createdAt = (task as any)?.createdAt;
    if (!createdAt) return "";
    try {
      return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(createdAt));
    } catch {
      return createdAt;
    }
  }, [task, locale]);

  const priorityOptions: SelectOption[] = [
    { label: t.priorityLow, value: "LOW" },
    { label: t.priorityMedium, value: "MEDIUM" },
    { label: t.priorityHigh, value: "HIGH" },
  ];

  const projectOptions: SelectOption[] = [
    { label: t.selectProject, value: "NONE" },
    ...projects.map((p) => ({ label: p.title, value: p.id })),
    { label: t.addProject, value: "REDIRECT" },
  ];

  const handleProjectSelect = (value: string) => {
    if (value === "REDIRECT") {
      onClose();
      router.push("/dashboard/projects");
    } else {
      projectField.onChange(value);
    }
  };

  React.useEffect(() => {
    if (isOpen) setIsConfirmingDelete(false);
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        projectId: task.projectId || "NONE",
      });
    }
  }, [task, reset, isOpen]);

  if (!task) return null;

  const onSubmit = (data: EditTaskInput) => {
    onUpdateTask(task.id, {
      title: data.title,
      description: data.description || "",
      priority: data.priority,
      projectId: data.projectId === "NONE" ? undefined : data.projectId,
    });
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t.editTask}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative">
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
          errorMessage={errors.title ? t.titleRequired : undefined}
          {...register("title")}
        />

        <div className="flex flex-col gap-1.5 relative z-20">
          <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            {t.descriptionTask || "Description"}
          </label>
          <RichTextEditor
            value={descriptionField.value || ""}
            onChange={descriptionField.onChange}
            placeholder={t.placeholderTaskDesc}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-40">
          <div className="flex flex-col gap-1.5 relative z-40">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {t.priority}
            </label>
            <Select
              value={priorityField.value}
              onChange={priorityField.onChange}
              options={priorityOptions}
            />
          </div>
          <div className="flex flex-col gap-1.5 relative z-40">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {t.projects}
            </label>
            <Select
              value={projectField.value}
              onChange={handleProjectSelect}
              options={projectOptions}
              dropdownHeightClass="max-h-44"
            />
          </div>
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
                    onDeleteTask(task.id);
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
                {t.delete}
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
