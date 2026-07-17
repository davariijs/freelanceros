import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  BackHandler,
  Alert,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { ProjectScrollerPicker } from "@/features/projects/components/ProjectScrollerPicker";
import { useProjectsQuery } from "@/features/projects/hooks/useProjects";
import { useCreateTaskMutation } from "@/features/tasks/hooks/useTasks";
import * as Haptics from "expo-haptics";
import { Plus } from "lucide-react-native";
import { useApp } from "@/context/AppContext";

interface QuickAddSheetProps {
  onSuccess: () => void;
}

export const QuickAddSheet = React.forwardRef<BottomSheet, QuickAddSheetProps>(
  ({ onSuccess }, ref) => {
    const { t, theme, isCommandOpen } = useApp();
    const isDark = theme === "dark";

    const [title, setTitle] = React.useState("");
    const [selectedProjectId, setSelectedProjectId] = React.useState<
      string | null
    >(null);
    const [isSaving, setIsLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const inputRef = React.useRef<any>(null);

    const { data: projects = [] } = useProjectsQuery();
    const createTaskMutation = useCreateTaskMutation();

    const snapPoints = React.useMemo(() => [300], []);

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

    const handleSave = () => {
      if (!title.trim() || isSaving) return;

      setIsLoading(true);
      Keyboard.dismiss();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      createTaskMutation.mutate(
        {
          title: title.trim(),
          description: "",
          priority: "MEDIUM",
          status: "TODO",
          projectId: selectedProjectId || undefined,
        },
        {
          onSuccess: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTitle("");
            setSelectedProjectId(null);
            onSuccess();
          },
          onError: (err: unknown) => {
            const error = err as {
              response?: { data?: { message?: string } };
              message?: string;
            };
            const serverMessage =
              error.response?.data?.message || error.message;

            if (serverMessage === "OFFLINE_SAVED") {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              setTitle("");
              setSelectedProjectId(null);
              onSuccess();
            } else {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              const localizedMessage =
                serverMessage === "Cannot add tasks to a paused project."
                  ? t.errorPausedProject || serverMessage
                  : serverMessage;
              Alert.alert(
                t.errorTitle || "Error",
                localizedMessage || "Failed to create task",
              );
            }
          },
          onSettled: () => {
            setIsLoading(false);
          },
        },
      );
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
        backdropComponent={isCommandOpen ? renderBackdrop : undefined}
        onChange={(index) => {
          const isSheetOpen = index !== -1;
          setIsOpen(isSheetOpen);
          if (index === 0) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 50);
          } else if (index === -1) {
            onSuccess();
          }
        }}
        backgroundStyle={{
          backgroundColor: isDark ? "#0f0f0f" : "#ffffff",
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#262626" : "#e5e5e5",
        }}
      >
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        >
          <View className="flex-1 px-6 pt-2 gap-5">
            <Text
              className={`text-base font-black ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
            >
              {t.quickAddTitle}
            </Text>

            <View
              className={`flex-row items-center border rounded-xl px-3 mb-2 h-12 ${isDark ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-300 bg-white"}`}
            >
              <BottomSheetTextInput
                ref={inputRef}
                className={`flex-1 text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                value={title}
                onChangeText={setTitle}
                placeholder={t.placeholderQuickAddTask}
                placeholderTextColor="#737373"
              />
            </View>

            <ProjectScrollerPicker
              projects={projects}
              selectedId={selectedProjectId}
              onSelect={setSelectedProjectId}
            />

            <TouchableOpacity
              onPress={handleSave}
              disabled={!title.trim() || isSaving}
              style={{ opacity: !title.trim() ? 0.5 : 1 }}
              className={`flex-row justify-center items-center h-12 rounded-xl mt-3 ${
                isDark
                  ? "bg-neutral-100 active:bg-neutral-200"
                  : "bg-neutral-950 active:bg-neutral-800"
              }`}
            >
              {isSaving ? (
                <ActivityIndicator
                  size="small"
                  color={isDark ? "#0a0a0a" : "#ffffff"}
                />
              ) : (
                <>
                  <Plus
                    size={16}
                    color={isDark ? "#0a0a0a" : "#ffffff"}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    className={`text-sm font-bold ${isDark ? "text-neutral-950" : "text-white"}`}
                  >
                    {t.quickAddTitle}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

QuickAddSheet.displayName = "QuickAddSheet";
