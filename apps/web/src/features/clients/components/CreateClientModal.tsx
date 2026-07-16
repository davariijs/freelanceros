"use client";

import * as React from "react";
import { useForm, useController, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Dialog } from "@/components/ui/Dialog";
import { FormField } from "@/components/ui/FormField";
import { Select, SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { ClientStatus } from "@freelanceos/database";

const getCreateClientSchema = (t: any) =>
  z.object({
    name: z.string().min(1, t.clientNameRequired),
    email: z.string().email(t.emailRequired).optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    website: z.string().optional().or(z.literal("")),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    socials: z
      .array(
        z.object({
          platform: z.string().min(1, "Required"),
          value: z.string().min(1, "Required"),
        }),
      )
      .optional(),
  });

type CreateClientInput = z.infer<ReturnType<typeof getCreateClientSchema>>;

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitClient: (data: {
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    socials?: { platform: string; value: string }[];
    status: ClientStatus;
  }) => void;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({
  isOpen,
  onClose,
  onSubmitClient,
}) => {
  const { t } = useApp();

  const createClientSchema = React.useMemo(() => getCreateClientSchema(t), [t]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      status: "ACTIVE",
      socials: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials",
  });

  const { field: statusField } = useController({ name: "status", control });

  const statusOptions: SelectOption[] = [
    { label: t.clientStatusActive, value: "ACTIVE" },
    { label: t.clientStatusInactive, value: "INACTIVE" },
  ];

  const onSubmit = (data: CreateClientInput) => {
    onSubmitClient({
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      website: data.website || undefined,
      socials: data.socials,
      status: data.status as ClientStatus,
    });
    reset();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t.createClient}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-h-[75vh] overflow-y-auto px-1"
      >
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
        <FormField
          label={t.phone || "Phone Number"}
          type="text"
          placeholder="+123456789"
          errorMessage={errors.phone ? errors.phone.message : undefined}
          {...register("phone")}
        />
        <FormField
          label={t.website || "Website / URL"}
          type="text"
          placeholder="https://company.com"
          errorMessage={errors.website ? errors.website.message : undefined}
          {...register("website")}
        />

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

        <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
              {t.socialAccounts || "Social Handles"}
            </label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => append({ platform: "", value: "" })}
              className="h-8 px-2.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold">
                {t.addSocial || "Add"}
              </span>
            </Button>
          </div>

          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t.platformPlaceholder || "e.g., Telegram"}
                  className="w-1/3 h-10 px-3 rounded-lg border bg-transparent text-xs border-neutral-300 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-400/50 outline-none text-neutral-900 dark:text-neutral-100"
                  {...register(`socials.${index}.platform` as const)}
                />
                <input
                  type="text"
                  placeholder={t.idPlaceholder || "@username"}
                  className="grow h-10 px-3 rounded-lg border bg-transparent text-xs border-neutral-300 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-400/50 outline-none text-neutral-900 dark:text-neutral-100"
                  {...register(`socials.${index}.value` as const)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="h-10 w-10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

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
