import * as React from "react";
import { View, Text, TouchableOpacity, BackHandler, Share } from "react-native";
import {
  useForm,
  useController,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Select, SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Trash2, Copy, Plus } from "lucide-react-native";
import { z } from "zod";
import * as Haptics from "expo-haptics";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { cn } from "@/lib/utils";

export type ClientStatus = "ACTIVE" | "INACTIVE";

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

interface EditClientSheetProps {
  onSuccess: () => void;
  client: any | null;
  onUpdateClient: (id: string, data: any) => void;
  onDeleteClient: (id: string) => void;
}

export const EditClientSheet = React.forwardRef<
  BottomSheet,
  EditClientSheetProps
>(({ onSuccess, client, onUpdateClient, onDeleteClient }, ref) => {
  const { t, isDark, showToast } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

  const currentSchema = React.useMemo(() => editClientSchema(t), [t]);

  const {
    control,
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

  const snapPoints = React.useMemo(() => ["88%"], []);

  React.useEffect(() => {
    if (isOpen) {
      const backAction = () => {
        onSuccess();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );
      return () => backHandler.remove();
    }
  }, [isOpen, onSuccess]);

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

  const statusOptions: SelectOption[] = [
    { label: t.clientStatusActive, value: "ACTIVE" },
    { label: t.clientStatusInactive, value: "INACTIVE" },
  ];

  const handleCopyText = async (fieldName: "phone" | "website" | number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let textToCopy = "";
    if (typeof fieldName === "number") {
      const socials = getValues("socials");
      textToCopy = socials?.[fieldName]?.value || "";
    } else {
      textToCopy = getValues(fieldName) || "";
    }

    if (textToCopy) {
      try {
        await Share.share({
          message: textToCopy,
        });
      } catch (error) {
        showToast("Failed to share", "error");
      }
    }
  };

  const onSubmit = (data: EditClientInput) => {
    if (client) {
      onUpdateClient(client.id, {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        website: data.website || undefined,
        socials: data.socials,
        status: data.status as ClientStatus,
      });
    }
    onSuccess();
  };

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      onChange={(index) => {
        setIsOpen(index !== -1);
        if (index === -1) {
          onSuccess();
        }
      }}
      backgroundStyle={{ backgroundColor: isDark ? "#0f0f0f" : "#ffffff" }}
      handleIndicatorStyle={{ backgroundColor: isDark ? "#262626" : "#e5e5e5" }}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 120,
        }}
      >
        <View className="gap-5">
          <Text
            className={`text-base font-black ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
          >
            {t.editClient || "Edit Client"}
          </Text>

          <View className="gap-4">
            <View className="gap-1.5">
              <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {t.clientName} *
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <View
                    className={`border rounded-xl px-3 h-11 justify-center ${errors.name ? "border-red-500 bg-red-500/5" : isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-300 bg-neutral-50"}`}
                  >
                    <BottomSheetTextInput
                      className={`text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                      value={value}
                      onChangeText={onChange}
                      placeholder={t.clientName}
                      placeholderTextColor="#737373"
                    />
                  </View>
                )}
              />
            </View>

            <View className="gap-1.5">
              <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {t.clientEmail}
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <View
                    className={`border rounded-xl px-3 h-11 justify-center ${errors.email ? "border-red-500 bg-red-500/5" : isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-300 bg-neutral-50"}`}
                  >
                    <BottomSheetTextInput
                      className={`text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                      value={value}
                      onChangeText={onChange}
                      placeholder="client@company.com"
                      placeholderTextColor="#737373"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                )}
              />
            </View>

            <View className="gap-1.5">
              <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {t.phone || "Phone"}
              </Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <View
                    className={`border rounded-xl pl-3 pr-12 h-11 justify-center relative ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-300 bg-neutral-50"}`}
                  >
                    <BottomSheetTextInput
                      className={`text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                      value={value}
                      onChangeText={onChange}
                      placeholder="+123456789"
                      placeholderTextColor="#737373"
                      keyboardType="phone-pad"
                    />
                    <TouchableOpacity
                      onPress={() => handleCopyText("phone")}
                      className="absolute right-2 h-8 w-8 items-center justify-center rounded-lg"
                    >
                      <Copy size={14} color="#737373" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>

            <View className="gap-1.5">
              <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {t.website || "Website"}
              </Text>
              <Controller
                control={control}
                name="website"
                render={({ field: { onChange, value } }) => (
                  <View
                    className={`border rounded-xl pl-3 pr-12 h-11 justify-center relative ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-300 bg-neutral-50"}`}
                  >
                    <BottomSheetTextInput
                      className={`text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                      value={value}
                      onChangeText={onChange}
                      placeholder="https://company.com"
                      placeholderTextColor="#737373"
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => handleCopyText("website")}
                      className="absolute right-2 h-8 w-8 items-center justify-center rounded-lg"
                    >
                      <Copy size={14} color="#737373" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>

            <View className="flex-col gap-1.5">
              <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {t.status}
              </Text>
              <Select
                value={statusField.value}
                onChange={statusField.onChange}
                options={statusOptions}
                isDark={isDark}
              />
            </View>

            <View className="gap-3 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/50">
              <View className="flex-row items-center justify-between flex">
                <Text className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                  {t.socialAccounts || "Social Handles"}
                </Text>
                <Button
                  variant="secondary"
                  onPress={() => append({ platform: "", value: "" })}
                  className="h-8 px-2.5 rounded-lg flex-row items-center gap-1"
                  isDark={isDark}
                >
                  <Plus size={12} color={isDark ? "white" : "#000000"} />
                  <Text
                    className={cn(
                      "text-[10px] font-bold",
                      isDark ? "text-neutral-300" : "text-neutral-700",
                    )}
                  >
                    {t.addSocial || "Add"}
                  </Text>
                </Button>
              </View>

              <View className="gap-2">
                {fields.map((field, index) => (
                  <View key={field.id} className="flex-row items-center gap-2">
                    <Controller
                      control={control}
                      name={`socials.${index}.platform` as const}
                      render={({ field: { onChange, value } }) => (
                        <View
                          className={`w-1/3 h-10 px-3 rounded-lg border justify-center ${isDark ? "border-neutral-800" : "border-neutral-300 bg-white"}`}
                        >
                          <BottomSheetTextInput
                            placeholder={t.platformPlaceholder || "Platform"}
                            placeholderTextColor="#737373"
                            className={`text-xs h-full ${isDark ? "text-white" : "text-neutral-900"}`}
                            value={value}
                            onChangeText={onChange}
                          />
                        </View>
                      )}
                    />
                    <Controller
                      control={control}
                      name={`socials.${index}.value` as const}
                      render={({ field: { onChange, value } }) => (
                        <View
                          className={`flex-1 h-10 pl-3 pr-10 rounded-lg border justify-center ${isDark ? "border-neutral-800" : "border-neutral-300 bg-white"}`}
                        >
                          <BottomSheetTextInput
                            placeholder={t.idPlaceholder || "ID/Handle"}
                            placeholderTextColor="#737373"
                            className={`text-xs h-full ${isDark ? "text-white" : "text-neutral-900"}`}
                            value={value}
                            onChangeText={onChange}
                          />
                          <TouchableOpacity
                            onPress={() => handleCopyText(index)}
                            className="absolute right-1.5 h-8 w-8 items-center justify-center rounded-lg"
                          >
                            <Copy size={12} color="#737373" />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                    <TouchableOpacity
                      onPress={() => remove(index)}
                      className={`h-10 w-10 items-center justify-center rounded-lg ${isDark ? "bg-red-500/10 active:bg-red-500/20" : "bg-red-50 active:bg-red-100"}`}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View
            className={`pt-4 border-t mt-6 ${isDark ? "border-neutral-900" : "border-neutral-200"}`}
          >
            {isConfirmingDelete ? (
              <View className="flex-col gap-3 p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                <Text className="text-xs font-semibold text-red-500 text-center">
                  {t.confirmDelete}
                </Text>
                <View className="flex-row gap-2 w-full">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onPress={() => setIsConfirmingDelete(false)}
                    isDark={isDark}
                  >
                    {t.cancel}
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-red-600 border-transparent"
                    isDark={isDark}
                    onPress={() => {
                      if (client) {
                        onDeleteClient(client.id);
                      }
                      onSuccess();
                    }}
                  >
                    <Text className="text-xs font-bold text-white">
                      {t.delete}
                    </Text>
                  </Button>
                </View>
              </View>
            ) : (
              <View className="flex-row justify-between items-center">
                <TouchableOpacity
                  onPress={() => setIsConfirmingDelete(true)}
                  className={`h-10 w-10 rounded-lg items-center justify-center ${isDark ? "bg-red-500/10 active:bg-red-500/20" : "bg-red-50 active:bg-red-100"}`}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
                <View className="flex-row gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onPress={onSuccess}
                    isDark={isDark}
                  >
                    {t.cancel}
                  </Button>
                  <Button onPress={handleSubmit(onSubmit)} isDark={isDark}>
                    <Text
                      className={`text-xs font-bold ${isDark ? "text-neutral-950" : "text-white"}`}
                    >
                      {t.save}
                    </Text>
                  </Button>
                </View>
              </View>
            )}
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

EditClientSheet.displayName = "EditClientSheet";
