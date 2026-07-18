import * as React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useApp } from "@/context/AppContext";
import { CreateProjectSheet } from "@/features/projects/components/CreateProjectSheet";
import { EditProjectSheet } from "@/features/projects/components/EditProjectSheet";
import { SearchBar } from "@/components/ui/SearchBar";
import { useClientsQuery } from "@/features/clients/hooks/useClients";
import {
  useProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/features/projects/hooks/useProjects";
import { Plus, FolderGit2, Clock, Pencil, Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import BottomSheet from "@gorhom/bottom-sheet";
import { formatDateStrict } from "@/lib/dateConverter";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "PAUSED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export default function ProjectsScreen() {
  const { t, theme, locale } = useApp();
  const isDark = theme === "dark";
  const isJalali = locale === "fa";
  const insets = useSafeAreaInsets();

  const createSheetRef = React.useRef<BottomSheet>(null);
  const editSheetRef = React.useRef<BottomSheet>(null);

  const [selectedProject, setSelectedProject] = React.useState<any | null>(
    null,
  );

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const { data: projects = [], isLoading } = useProjectsQuery();
  const { data: clients = [] } = useClientsQuery();

  const createProjectMutation = useCreateProjectMutation();
  const updateProjectMutation = useUpdateProjectMutation();
  const deleteProjectMutation = useDeleteProjectMutation();

  const handleCreateProject = (data: any) => {
    createProjectMutation.mutate(data, {
      onSuccess: () => {
        createSheetRef.current?.close();
      },
    });
  };

  const handleUpdateProject = (id: string, data: any) => {
    updateProjectMutation.mutate(
      { id, ...data },
      {
        onSuccess: () => {
          editSheetRef.current?.close();
          setSelectedProject(null);
        },
      },
    );
  };

  const handleDeleteProject = (id: string) => {
    deleteProjectMutation.mutate(id, {
      onSuccess: () => {
        editSheetRef.current?.close();
        setSelectedProject(null);
      },
    });
  };

  const handleOpenCreate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createSheetRef.current?.snapToIndex(0);
  };

  const handleOpenEdit = (project: any) => {
    setSelectedProject(project);
    requestAnimationFrame(() => {
      editSheetRef.current?.snapToIndex(0);
    });
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const filteredProjects = React.useMemo(() => {
    const sorted = [...projects].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter((p) => p.title.toLowerCase().includes(q));
  }, [projects, searchQuery]);

  const getProgressWidthClass = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "w-full bg-emerald-500";

      case "ACTIVE":
        return isDark ? "w-2/3 bg-violet-400" : "w-2/3 bg-violet-600";

      case "PLANNING":
        return "w-1/4 bg-sky-500";

      case "PAUSED":
        return "w-1/2 bg-amber-500";

      default:
        return isDark ? "w-1/2 bg-neutral-400" : "w-1/2 bg-neutral-500";
    }
  };

  const getPriorityStyles = (priority: TaskPriority) => {
    switch (priority) {
      case "LOW":
        return {
          text: "text-emerald-500",
          bgBorder: "bg-emerald-500/10 border-emerald-500/20",
        };
      case "HIGH":
        return {
          text: "text-red-500",
          bgBorder: "bg-red-500/10 border-red-500/20",
        };
      default:
        return {
          text: "text-amber-500",
          bgBorder: "bg-amber-500/10 border-amber-500/20",
        };
    }
  };

  const priorityLabels = {
    LOW: t.priorityLow || "Low",
    MEDIUM: t.priorityMedium || "Medium",
    HIGH: t.priorityHigh || "High",
  };

  const getFormattedDueDate = (dueDate?: string | null) => {
    if (!dueDate) return t.noProject || "Ongoing";
    return formatDateStrict(dueDate, isJalali);
  };

  const dynamicBg = isDark ? "#0a0a0a" : "#f5f5f5";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: dynamicBg,
        paddingTop: insets.top + 16,
      }}
    >
      <View style={{ flex: 1, paddingHorizontal: 20, position: "relative" }}>
        <View className="flex-row items-center justify-between mb-6 shrink-0">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsSearchOpen(true);
            }}
            style={{
              backgroundColor: isDark ? "#171717" : "#ffffff",
              borderColor: isDark ? "#262626" : "#e5e5e5",
            }}
            className="h-10 w-10 border rounded-full items-center justify-center active:bg-neutral-800"
          >
            <Search size={18} color="#a3a3a3" />
          </TouchableOpacity>

          <Text
            className={`text-xl font-bold ${isDark ? "text-white" : "text-neutral-900"}`}
          >
            {t.projects}
          </Text>

          <TouchableOpacity
            onPress={handleOpenCreate}
            style={{
              backgroundColor: isDark ? "#171717" : "#ffffff",
              borderColor: isDark ? "#262626" : "#e5e5e5",
            }}
            className="h-10 w-10 border rounded-full items-center justify-center active:bg-neutral-800"
          >
            <Plus size={18} color="#a3a3a3" />
          </TouchableOpacity>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t.placeholderSearchProjects || "Search projects..."}
          isOpen={isSearchOpen}
          onClose={handleCloseSearch}
          isDark={isDark}
        />

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-sm text-neutral-400">
              {t.mainloading || "Loading Projects..."}
            </Text>
          </View>
        ) : filteredProjects.length === 0 ? (
          <View className="flex-1 justify-center items-center text-center">
            <FolderGit2 size={32} color="#737373" className="mb-2" />
            <Text className="text-sm text-neutral-500">{t.noProjects}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProjects}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const priorityColor = getPriorityStyles(item.priority);
              return (
                <View
                  className={`p-4 rounded-2xl border mb-3 flex-col gap-3.5 ${
                    isDark
                      ? "bg-neutral-900 border-neutral-800"
                      : "bg-white border-neutral-200"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-2.5 min-w-0 flex-1">
                      <Text
                        className={`text-sm font-bold truncate max-w-37.5 ${isDark ? "text-white" : "text-neutral-900"}`}
                      >
                        {item.title}
                      </Text>
                      <View
                        className={cn(
                          "px-2.5 py-1 rounded-full border shrink-0",
                          isDark ? "bg-neutral-950" : "bg-neutral-50",
                          priorityColor.bgBorder,
                        )}
                      >
                        <Text
                          className={cn(
                            "text-[9px] font-black uppercase",
                            priorityColor.text,
                          )}
                        >
                          {priorityLabels[item.priority]}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1">
                        <Clock size={10} color="#737373" />
                        <Text className="text-[10px] text-neutral-500 font-medium">
                          {getFormattedDueDate(item.dueDate)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleOpenEdit(item)}
                        className={`h-7 w-7 rounded-full items-center justify-center ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}
                      >
                        <Pencil size={12} color="#737373" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <View
                      className={cn(
                        "h-full rounded-full",
                        getProgressWidthClass(item.status),
                      )}
                    />
                  </View>
                </View>
              );
            }}
          />
        )}

        <CreateProjectSheet
          ref={createSheetRef}
          onSuccess={() => {
            createSheetRef.current?.close();
          }}
          clients={clients}
          onSubmitProject={handleCreateProject}
        />

        <EditProjectSheet
          ref={editSheetRef}
          onSuccess={() => {
            editSheetRef.current?.close();
            setSelectedProject(null);
          }}
          project={selectedProject}
          clients={clients}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
        />
      </View>
    </View>
  );
}
