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
import { TaskPriority } from "@/features/tasks/schemas/task.schema";
import { ProjectStatus } from "@/features/projects/schemas/project.schema";
import { useRouter } from "next/navigation";

const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["PLANNING", "ACTIVE", "COMPLETED", "PAUSED"]),
  clientId: z.string().optional(),
});

type CreateProjectInput = z.infer<typeof createProjectSchema>;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: { id: string; name: string }[];
  onSubmitProject: (data: {
    title: string;
    dueDate: string;
    priority: TaskPriority;
    status: ProjectStatus;
    clientId?: string;
  }) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  clients = [],
  onSubmitProject,
}) => {
  const { t } = useApp();
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      dueDate: "",
      priority: "MEDIUM",
      status: "PLANNING",
      clientId: "NONE",
    },
  });

  const { field: dateField } = useController({ name: "dueDate", control });
  const { field: priorityField } = useController({ name: "priority", control });
  const { field: statusField } = useController({ name: "status", control });
  const { field: clientField } = useController({ name: "clientId", control });

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

  const onSubmit = (data: CreateProjectInput) => {
    onSubmitProject({
      title: data.title,
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
      clientId: data.clientId === "NONE" ? undefined : data.clientId,
    });
    reset();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t.createProject}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button type="submit">{t.createProject}</Button>
        </div>
      </form>
    </Dialog>
  );
};
