import * as React from "react";
import { View, Text, BackHandler } from "react-native";
import { useForm, useController, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Select, SelectOption } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { z } from "zod";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "PAUSED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["PLANNING", "ACTIVE", "COMPLETED", "PAUSED"]),
  clientId: z.string().optional(),
});

type CreateProjectInput = z.infer<typeof createProjectSchema>;

interface CreateProjectSheetProps {
  onSuccess: () => void;
  clients: { id: string; name: string }[];
  onSubmitProject: (data: {
    title: string;
    dueDate: string;
    priority: TaskPriority;
    status: ProjectStatus;
    clientId?: string;
  }) => void;
}

export const CreateProjectSheet = React.forwardRef<
  BottomSheet,
  CreateProjectSheetProps
>(({ onSuccess, clients = [], onSubmitProject }, ref) => {
  const { t, theme } = useApp();
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = React.useState(false);

  const {
    control,
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

  const priorityOptions: SelectOption[] = [
    { label: t.priorityLow || "Low", value: "LOW" },
    { label: t.priorityMedium || "Medium", value: "MEDIUM" },
    { label: t.priorityHigh || "High", value: "HIGH" },
  ];

  const statusOptions: SelectOption[] = [
    { label: t.statusPlanning || "Planning", value: "PLANNING" },
    { label: t.statusActive || "Active", value: "ACTIVE" },
    { label: t.statusPaused || "Paused", value: "PAUSED" },
    { label: t.statusCompleted || "Completed", value: "COMPLETED" },
  ];

  const clientOptions: SelectOption[] = [
    { label: t.selectClient || "Select Client", value: "NONE" },
    ...clients.map((c) => ({ label: c.name, value: c.id })),
  ];

  const onSubmit = (data: CreateProjectInput) => {
    onSubmitProject({
      title: data.title,
      dueDate: data.dueDate,
      priority: data.priority as TaskPriority,
      status: data.status as ProjectStatus,
      clientId: data.clientId === "NONE" ? undefined : data.clientId,
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
        <View className="gap-5">
          <Text
            className={`text-base font-black ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
          >
            {t.createProject}
          </Text>

          <View className="gap-4">
            <View className="gap-y-1.5" style={{ zIndex: 50 }}>
              <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {t.title} <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <View
                    className={`border rounded-xl px-3 h-11 justify-center ${errors.title ? "border-red-500 bg-red-500/5" : isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-300 bg-neutral-50"}`}
                  >
                    <BottomSheetTextInput
                      className={`text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                      value={value}
                      onChangeText={onChange}
                      placeholder={t.title}
                      placeholderTextColor="#737373"
                    />
                  </View>
                )}
              />
            </View>

            <View className="gap-1.5" style={{ zIndex: 40 }}>
              <DatePicker
                value={dateField.value}
                onChange={dateField.onChange}
                placeholder={t.placeholderProjectDate || "Due Date"}
                required
              />
            </View>

            <View className="flex-col gap-1.5" style={{ zIndex: 30 }}>
              <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {t.priority}
              </Text>
              <Select
                value={priorityField.value}
                onChange={priorityField.onChange}
                options={priorityOptions}
                isDark={isDark}
              />
            </View>

            <View className="flex-col gap-1.5" style={{ zIndex: 20 }}>
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

            <View className="flex-col gap-1.5" style={{ zIndex: 10 }}>
              <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {t.clients}
              </Text>
              <Select
                value={clientField.value || "NONE"}
                onChange={clientField.onChange}
                options={clientOptions}
                isDark={isDark}
              />
            </View>
          </View>

          <View
            className={`flex-row justify-end gap-3 pt-6 mt-6 border-t ${isDark ? "border-neutral-900" : "border-neutral-200"}`}
            style={{ zIndex: 1 }}
          >
            <Button
              type="button"
              variant="secondary"
              onPress={onSuccess}
              isDark={isDark}
            >
              {t.cancel}
            </Button>
            <Button
              type="button"
              onPress={handleSubmit(onSubmit)}
              isDark={isDark}
            >
              <Text
                className={`text-xs font-bold ${isDark ? "text-neutral-950" : "text-white"}`}
              >
                {t.createProject}
              </Text>
            </Button>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

CreateProjectSheet.displayName = "CreateProjectSheet";
