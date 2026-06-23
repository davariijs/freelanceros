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

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

type CreateTaskInput = z.infer<typeof createTaskSchema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTask: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
  }) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmitTask,
}) => {
  const { t } = useApp();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: "", description: "", priority: "MEDIUM" },
  });

  const { field: priorityField } = useController({ name: "priority", control });

  const priorityOptions: SelectOption[] = [
    { label: t.priorityLow, value: "LOW" },
    { label: t.priorityMedium, value: "MEDIUM" },
    { label: t.priorityHigh, value: "HIGH" },
  ];

  const onSubmit = (data: CreateTaskInput) => {
    onSubmitTask({
      title: data.title,
      description: data.description || "",
      priority: data.priority,
      status: "TODO",
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
          errorMessage={errors.title ? t.titleRequired : undefined}
          {...register("title")}
        />
        <FormField
          label={t.descriptionTask}
          placeholder={t.placeholderTaskDesc}
          {...register("description")}
        />

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
