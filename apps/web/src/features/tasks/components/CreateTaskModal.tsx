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
import { TaskStatus, TaskPriority } from "@/features/tasks/schemas/task.schema";
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
  const { field: descriptionField } = useController({
    name: "description",
    control,
  });

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <FormField
            label={t.title}
            placeholder={t.placeholderTaskTitle}
            required
            errorMessage={errors.title ? t.titleRequired : undefined}
            {...register("title")}
          />

          <div className="grid grid-cols-2 gap-4 pb-4">
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
                dropdownHeightClass="max-h-44"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {t.descriptionTask || "Description"}
            </label>
            <RichTextEditor
              value={descriptionField.value || ""}
              onChange={descriptionField.onChange}
              placeholder={t.placeholderTaskDesc}
            />
          </div>
        </div>

        <div className="shrink-0 p-4 md:p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end gap-3 mt-auto">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="max-md:flex-1"
          >
            {t.cancel}
          </Button>
          <Button type="submit" className="max-md:flex-1">
            {t.createTask}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
