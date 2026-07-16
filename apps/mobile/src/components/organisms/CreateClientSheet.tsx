import * as React from "react";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import {
  useForm,
  useController,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Select, SelectOption } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";
import { Plus, Trash2 } from "lucide-react-native";
import { z } from "zod";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

export type ClientStatus = "ACTIVE" | "INACTIVE";

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

interface CreateClientSheetProps {
  onSuccess: () => void;
  onSubmitClient: (data: {
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    socials?: { platform: string; value: string }[];
    status: ClientStatus;
  }) => void;
}

export const CreateClientSheet = React.forwardRef<
  BottomSheet,
  CreateClientSheetProps
>(({ onSuccess, onSubmitClient }, ref) => {
  const { t, theme } = useApp();
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = React.useState(false);

  const createClientSchema = React.useMemo(() => getCreateClientSchema(t), [t]);

  const {
    control,
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
          reset();
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
        <BottomSheetView className="gap-5 px-5">
          <Text
            className={`text-base font-black ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
          >
            {t.createClient}
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
                    className={`border rounded-xl px-3 h-11 justify-center ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-300 bg-neutral-50"}`}
                  >
                    <BottomSheetTextInput
                      className={`text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                      value={value}
                      onChangeText={onChange}
                      placeholder="+123456789"
                      placeholderTextColor="#737373"
                      keyboardType="phone-pad"
                    />
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
                    className={`border rounded-xl px-3 h-11 justify-center ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-300 bg-neutral-50"}`}
                  >
                    <BottomSheetTextInput
                      className={`text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                      value={value}
                      onChangeText={onChange}
                      placeholder="https://company.com"
                      placeholderTextColor="#737373"
                      autoCapitalize="none"
                    />
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
                  <Text className="text-[10px] font-bold">
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
                          className={`flex-1 h-10 px-3 rounded-lg border justify-center ${isDark ? "border-neutral-800" : "border-neutral-300 bg-white"}`}
                        >
                          <BottomSheetTextInput
                            placeholder={t.idPlaceholder || "ID/Handle"}
                            placeholderTextColor="#737373"
                            className={`text-xs h-full ${isDark ? "text-white" : "text-neutral-900"}`}
                            value={value}
                            onChangeText={onChange}
                          />
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
            className={`flex-row justify-end gap-3 pt-6 mt-6 border-t ${isDark ? "border-neutral-900" : "border-neutral-200"}`}
          >
            <Button variant="secondary" onPress={onSuccess} isDark={isDark}>
              {t.cancel}
            </Button>
            <Button onPress={handleSubmit(onSubmit)} isDark={isDark}>
              <Text
                className={`text-xs font-bold ${isDark ? "text-neutral-950" : "text-white"}`}
              >
                {t.createClient}
              </Text>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

CreateClientSheet.displayName = "CreateClientSheet";
