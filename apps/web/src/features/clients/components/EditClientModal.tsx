"use client";

import * as React from "react";
import { useForm, useController, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Dialog } from "@/components/ui/Dialog";
import { FormField } from "@/components/ui/FormField";
import { Select, SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Trash2, Copy, Plus, CalendarDays } from "lucide-react";
import { z } from "zod";
import { ClientStatus } from "@freelanceos/database";

const editClientSchema = (t: any) =>
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

type EditClientInput = z.infer<ReturnType<typeof editClientSchema>>;

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any | null;
  onUpdateClient: (
    id: string,
    data: {
      name: string;
      email?: string;
      phone?: string;
      website?: string;
      socials?: { platform: string; value: string }[];
      status: ClientStatus;
    },
  ) => void;
  onDeleteClient: (id: string) => void;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
  client,
  onUpdateClient,
  onDeleteClient,
}) => {
  const { t, showToast, locale } = useApp();
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

  const currentSchema = React.useMemo(() => editClientSchema(t), [t]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<EditClientInput>({
    resolver: zodResolver(currentSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials",
  });

  const { field: statusField } = useController({ name: "status", control });

  const formattedCreationDate = React.useMemo(() => {
    const createdAt = client?.createdAt;
    if (!createdAt) return "";
    try {
      return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(createdAt));
    } catch {
      return createdAt;
    }
  }, [client?.createdAt, locale]);

  const statusOptions: SelectOption[] = [
    { label: t.clientStatusActive, value: "ACTIVE" },
    { label: t.clientStatusInactive, value: "INACTIVE" },
  ];

  React.useEffect(() => {
    if (isOpen) setIsConfirmingDelete(false);
    if (client) {
      reset({
        name: client.name,
        email: client.email || "",
        phone: client.phone || "",
        website: client.website || "",
        status: client.status,
        socials: client.socials || [],
      });
    }
  }, [client, reset, isOpen]);

  if (!client) return null;

  const handleCopyText = (fieldName: "phone" | "website" | number) => {
    let textToCopy = "";
    if (typeof fieldName === "number") {
      const socials = getValues("socials");
      textToCopy = socials?.[fieldName]?.value || "";
    } else {
      textToCopy = getValues(fieldName) || "";
    }

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      showToast(t.copiedSuccess || "Copied to clipboard!", "success");
    }
  };

  const onSubmit = (data: EditClientInput) => {
    onUpdateClient(client.id, {
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      website: data.website || undefined,
      socials: data.socials,
      status: data.status as ClientStatus,
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t.editClient || "Edit Client"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
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

          <div className="relative">
            <FormField
              label={t.phone || "Phone Number"}
              type="text"
              placeholder="+123456789"
              errorMessage={errors.phone ? errors.phone.message : undefined}
              {...register("phone")}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleCopyText("phone")}
              className="absolute bottom-1.5 right-1.5 h-8 w-8 p-0 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="relative">
            <FormField
              label={t.website || "Website / URL"}
              type="text"
              placeholder="https://company.com"
              errorMessage={errors.website ? errors.website.message : undefined}
              {...register("website")}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleCopyText("website")}
              className="absolute bottom-1.5 right-1.5 h-8 w-8 p-0 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
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

          <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 pb-4">
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
                    placeholder={t.platformPlaceholder || "Platform"}
                    className="w-1/3 h-10 px-3 rounded-lg border bg-transparent text-xs border-neutral-300 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-400/50 outline-none text-neutral-900 dark:text-neutral-100"
                    {...register(`socials.${index}.platform` as const)}
                  />
                  <div className="grow relative">
                    <input
                      type="text"
                      placeholder={t.idPlaceholder || "Handle/ID"}
                      className="w-full h-10 pl-3 pr-10 rounded-lg border bg-transparent text-xs border-neutral-300 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-400/50 outline-none text-neutral-900 dark:text-neutral-100"
                      {...register(`socials.${index}.value` as const)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyText(index)}
                      className="absolute top-1 right-1 h-8 w-8 p-0 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
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
        </div>

        <div className="shrink-0 p-4 md:p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 mt-auto">
          {isConfirmingDelete ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50">
              <span className="text-sm font-semibold text-red-600 dark:text-red-400 text-center sm:text-left">
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
                  className="flex-1 sm:flex-none bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 border-transparent"
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
            <div className="flex justify-between items-center w-full">
              <Button
                type="button"
                variant="ghost"
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 max-md:px-2"
                onClick={() => setIsConfirmingDelete(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="flex gap-2 w-full justify-end sm:w-auto">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="max-md:flex-1"
                >
                  {t.cancel}
                </Button>
                <Button type="submit" className="max-md:flex-1">
                  {t.save}
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </Dialog>
  );
};
