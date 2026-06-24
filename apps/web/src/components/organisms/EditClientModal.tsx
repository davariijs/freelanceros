"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Dialog } from "@/components/atoms/Dialog";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { Trash2 } from "lucide-react";
import { z } from "zod";
import { Client } from "@/schemas/client";

const editClientSchema = (t: any) =>
  z.object({
    name: z.string().min(1, t.clientNameRequired),
    email: z.string().email(t.emailRequired).optional().or(z.literal("")),
  });

type EditClientInput = z.infer<ReturnType<typeof editClientSchema>>;

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onUpdateClient: (id: string, data: { name: string; email?: string }) => void;
  onDeleteClient: (id: string) => void;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
  client,
  onUpdateClient,
  onDeleteClient,
}) => {
  const { t } = useApp();
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

  const currentSchema = React.useMemo(() => editClientSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditClientInput>({
    resolver: zodResolver(currentSchema),
  });

  React.useEffect(() => {
    if (isOpen) setIsConfirmingDelete(false);
    if (client) {
      reset({
        name: client.name,
        email: client.email || "",
      });
    }
  }, [client, reset, isOpen]);

  if (!client) return null;

  const onSubmit = (data: EditClientInput) => {
    onUpdateClient(client.id, {
      name: data.name,
      email: data.email || undefined,
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t.editClient || "Edit Client"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label={t.clientName}
          required
          errorMessage={errors.name ? errors.name.message : undefined}
          {...register("name")}
        />
        <FormField
          label={t.clientEmail}
          type="email"
          placeholder="client@company.com"
          errorMessage={errors.email ? errors.email.message : undefined}
          {...register("email")}
        />

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
                    onDeleteClient(client.id);
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
