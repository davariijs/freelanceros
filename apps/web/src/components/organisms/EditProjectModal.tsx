"use client";

import * as React from "react";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Dialog } from "@/components/atoms/Dialog";
import { FormField } from "@/components/molecules/FormField";
import { DatePicker } from "@/components/atoms/DatePicker";
import { Select, SelectOption } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";
import { z } from "zod";
import { Project, ProjectStatus } from "@/schemas/project";
import { TaskPriority } from "@/schemas/task";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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
  const { t } = useApp();
  const router = useRouter();
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

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
    }
  }, [project, reset, isOpen]);

  if (!project) return null;

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
