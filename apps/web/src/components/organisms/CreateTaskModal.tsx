"use client";

import * as React from "react";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Dialog } from "@/components/atoms/Dialog";
import { FormField } from "@/components/molecules/FormField";
import { Select, SelectOption } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";
import { z } from "zod";
import { TaskStatus, TaskPriority } from "@/schemas/task";
import { useRouter } from "next/navigation";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  projectId: z.string().optional(),
});

type CreateTaskInput = z.infer<typeof createTaskSchema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: { id: string; title: string }[];
  onSubmitTask: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    projectId?: string;
  }) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSubmitTask,
}) => {
  const { t } = useApp();
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      projectId: "NONE",
    },
  });

  const { field: priorityField } = useController({ name: "priority", control });
  const { field: projectField } = useController({ name: "projectId", control });

  const priorityOptions: SelectOption[] = [
    { label: t.priorityLow, value: "LOW" },
    { label: t.priorityMedium, value: "MEDIUM" },
    { label: t.priorityHigh, value: "HIGH" },
  ];

  const projectOptions: SelectOption[] = [
    { label: t.noProjects, value: "NONE" },
    ...projects.map((p) => ({ label: p.title, value: p.id })),
    { label: "+ Add Project", value: "REDIRECT" },
  ];

  const handleProjectSelect = (value: string) => {
    if (value === "REDIRECT") {
      onClose();
      router.push("/dashboard/projects");
    } else {
      projectField.onChange(value);
    }
  };

  const onSubmit = (data: CreateTaskInput) => {
    onSubmitTask({
      title: data.title,
      description: data.description || "",
      priority: data.priority,
      status: "TODO",
      projectId: data.projectId === "NONE" ? undefined : data.projectId,
    });
    reset();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t.createTask}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label={t.title}
          placeholder={t.placeholderTaskTitle}
          required
          errorMessage={errors.title ? t.titleRequired : undefined}
          {...register("title")}
        />
        <FormField
          label={t.descriptionTask}
          placeholder={t.placeholderTaskDesc}
          {...register("description")}
        />

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
              {t.projects}
            </label>
            <Select
              value={projectField.value}
              onChange={handleProjectSelect}
              options={projectOptions}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button type="submit">{t.createTask}</Button>
        </div>
      </form>
    </Dialog>
  );
};
