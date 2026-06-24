"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Dialog } from "@/components/atoms/Dialog";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { z } from "zod";

const getCreateClientSchema = (t: any) =>
  z.object({
    name: z.string().min(1, t.clientNameRequired),
    email: z.string().email(t.emailRequired).optional().or(z.literal("")),
  });

type CreateClientInput = z.infer<ReturnType<typeof getCreateClientSchema>>;

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitClient: (data: { name: string; email?: string }) => void;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({
  isOpen,
  onClose,
  onSubmitClient,
}) => {
  const { t } = useApp();

  const createClientSchema = React.useMemo(() => getCreateClientSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = (data: CreateClientInput) => {
    onSubmitClient({
      name: data.name,
      email: data.email || undefined,
    });
    reset();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t.createClient}>
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

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button type="submit">{t.createClient}</Button>
        </div>
      </form>
    </Dialog>
  );
};
