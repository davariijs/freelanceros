import * as React from "react";
import { View, Text, TouchableOpacity, BackHandler, Share } from "react-native";
import { useForm, useController, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { Select, SelectOption } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { Trash2, Copy, Share2, CalendarDays } from "lucide-react-native";
import { z } from "zod";
import * as Haptics from "expo-haptics";
import apiClient from "@/lib/apiClient";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { formatDateTimeStrict } from "@/lib/dateConverter";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "PAUSED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

const editProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["PLANNING", "ACTIVE", "COMPLETED", "PAUSED"]),
  clientId: z.string().optional(),
});

type EditProjectInput = z.infer<typeof editProjectSchema>;

interface EditProjectSheetProps {
  onSuccess: () => void;
  project: any | null;
  clients?: { id: string; name: string }[];
  onUpdateProject: (id: string, data: any) => void;
  onDeleteProject: (id: string) => void;
}

export const EditProjectSheet = React.forwardRef<
  BottomSheet,
  EditProjectSheetProps
>(
  (
    { onSuccess, project, clients = [], onUpdateProject, onDeleteProject },
    ref,
  ) => {
    const { t, theme, showToast, locale } = useApp();
    const isDark = theme === "dark";
    const isJalali = locale === "fa";
    const [isOpen, setIsOpen] = React.useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);
    const [isShared, setIsShared] = React.useState(false);
    const [shareToken, setShareToken] = React.useState<string | null>(null);

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<EditProjectInput>({
      resolver: zodResolver(editProjectSchema),
    });

    const { field: dateField } = useController({ name: "dueDate", control });
    const { field: priorityField } = useController({
      name: "priority",
      control,
    });
    const { field: statusField } = useController({ name: "status", control });
    const { field: clientField } = useController({ name: "clientId", control });

    const snapPoints = React.useMemo(() => ["88%"], []);

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
        setIsShared(project.isShared);
        setShareToken(project.shareToken ?? null);
      }
    }, [project, reset, isOpen]);

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

    const formattedCreationDate = React.useMemo(() => {
      if (!project?.createdAt) return "";
      return formatDateTimeStrict(project.createdAt, isJalali);
    }, [project?.createdAt, isJalali]);

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

    const handleToggleShare = async () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      try {
        if (isShared) {
          await apiClient.post(`/api/projects/${project.id}/unshare`);
          setIsShared(false);
          setShareToken(null);
          showToast(
            t.shareDisabled || "Client portal link disabled",
            "success",
          );
        } else {
          const res = await apiClient.post(`/api/projects/${project.id}/share`);
          setIsShared(true);
          setShareToken(res.data.shareToken);
          showToast(
            t.shareEnabled || "Client portal link generated",
            "success",
          );
        }
      } catch (error) {
        showToast("Failed to update share settings", "error");
      }
    };

    const handleCopyLink = async () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (shareToken) {
        const fullUrl = `https://freelanceos.com/shared/${shareToken}`;
        try {
          await Share.share({
            message: fullUrl,
          });
        } catch {
          showToast("Failed to share link", "error");
        }
      }
    };

    const onSubmit = (data: EditProjectInput) => {
      if (project) {
        onUpdateProject(project.id, {
          title: data.title,
          dueDate: data.dueDate,
          priority: data.priority as TaskPriority,
          status: data.status as ProjectStatus,
          clientId: data.clientId === "NONE" ? undefined : data.clientId,
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
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#262626" : "#e5e5e5",
        }}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 120,
          }}
        >
          <BottomSheetView className="gap-y-5 px-5">
            <Text
              className={`text-base font-black ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
            >
              {t.editProject || "Edit Project"}
            </Text>

            <View className="gap-y-4">
              {formattedCreationDate && (
                <View
                  className={`flex-row items-center gap-3 p-3 rounded-xl border ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"}`}
                >
                  <CalendarDays size={18} color="#737373" />
                  <View className="flex-col">
                    <Text className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                      {t.creationDate || "Created At"}
                    </Text>
                    <Text
                      className={`text-xs font-semibold mt-0.5 ${isDark ? "text-neutral-200" : "text-neutral-800"}`}
                    >
                      {formattedCreationDate}
                    </Text>
                  </View>
                </View>
              )}

              <View className="gap-1.5" style={{ zIndex: 50 }}>
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

              <View className="gap-y-1.5" style={{ zIndex: 40 }}>
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

              <View
                className="gap-y-3 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/50"
                style={{ zIndex: 1 }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1.5">
                    <Share2 size={16} color="#10b981" />
                    <Text className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                      {t.clientPortalTitle || "Client Share Portal"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleToggleShare}
                    activeOpacity={0.8}
                    className="h-10 w-12 items-center justify-center rounded-lg"
                  >
                    <View
                      className={`w-10 h-6 rounded-full p-0.5 justify-center ${isShared ? "bg-emerald-500 items-end" : "bg-neutral-800 items-start"}`}
                    >
                      <View className="w-5 h-5 rounded-full bg-white shadow-sm" />
                    </View>
                  </TouchableOpacity>
                </View>

                {isShared && shareToken && (
                  <View className="flex-row items-center gap-2 animate-in slide-in-from-top-2 duration-200">
                    <View
                      className={`flex-1 h-10 px-3 rounded-lg border justify-center ${isDark ? "border-neutral-800 bg-neutral-950/20" : "border-neutral-300 bg-neutral-50/50"}`}
                    >
                      <Text
                        className="text-[10px] text-neutral-400 select-all"
                        numberOfLines={1}
                      >
                        https://freeos.com/shared/{shareToken}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleCopyLink}
                      className={`h-10 w-10 items-center justify-center rounded-lg ${isDark ? "bg-neutral-800 border border-neutral-700" : "bg-neutral-100 border border-neutral-200"}`}
                    >
                      <Copy size={14} color="#737373" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View
              className={`pt-4 border-t mt-6 ${isDark ? "border-neutral-900" : "border-neutral-200"}`}
              style={{ zIndex: 1 }}
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
                        onDeleteProject(project.id);
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
          </BottomSheetView>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

EditProjectSheet.displayName = "EditProjectSheet";
