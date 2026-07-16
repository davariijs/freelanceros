import * as React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Share,
} from "react-native";
import { useApp } from "@/context/AppContext";
import { CreateClientSheet } from "@/components/organisms/CreateClientSheet";
import { EditClientSheet } from "@/components/organisms/EditClientSheet";
import {
  useClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "@/hooks/useClients";
import { Plus, Users, Pencil, Phone, Globe, Mail } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomTabBar } from "@/components/molecules/BottomTabBar";

export default function ClientsScreen() {
  const { t, theme, showToast } = useApp();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();

  const createSheetRef = React.useRef<BottomSheet>(null);
  const editSheetRef = React.useRef<BottomSheet>(null);

  const [selectedClient, setSelectedClient] = React.useState<any | null>(null);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = React.useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false);

  const { data: clients = [], isLoading } = useClientsQuery();
  const createClientMutation = useCreateClientMutation();
  const updateClientMutation = useUpdateClientMutation();
  const deleteClientMutation = useDeleteClientMutation();

  const handleCreateClient = (data: any) => {
    createClientMutation.mutate(data, {
      onSuccess: () => {
        createSheetRef.current?.close();
        setIsCreateSheetOpen(false);
      },
    });
  };

  const handleUpdateClient = (id: string, data: any) => {
    updateClientMutation.mutate(
      { id, ...data },
      {
        onSuccess: () => {
          editSheetRef.current?.close();
          setSelectedClient(null);
          setIsEditSheetOpen(false);
        },
      },
    );
  };

  const handleDeleteClient = (id: string) => {
    deleteClientMutation.mutate(id, {
      onSuccess: () => {
        editSheetRef.current?.close();
        setSelectedClient(null);
        setIsEditSheetOpen(false);
      },
    });
  };

  const handleCall = (phone: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${phone}`).catch(() => {
      showToast(t.toastCannotOpenDialer || "Cannot open dialer", "error");
    });
  };

  const handleOpenUrl = (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    Linking.openURL(formattedUrl).catch(() => {
      showToast(t.toastCannotOpenWebsite || "Cannot open website", "error");
    });
  };

  const handleCopyId = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: id,
      });
    } catch (error) {
      showToast("Failed to share ID", "error");
    }
  };

  const handleOpenCreate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createSheetRef.current?.snapToIndex(0);
    setIsCreateSheetOpen(true);
  };

  const handleOpenEdit = (client: any) => {
    setSelectedClient(client);
    setIsEditSheetOpen(true);
    requestAnimationFrame(() => {
      editSheetRef.current?.snapToIndex(0);
    });
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
        <View className="mb-6 shrink-0">
          <Text
            className={`text-2xl font-black ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
          >
            {t.clients}
          </Text>
          <Text className="text-xs text-neutral-500 mt-1">
            {t.clientsDescription}
          </Text>
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-sm text-neutral-400">
              {t.sharedLoadingPortal || "Loading Clients..."}
            </Text>
          </View>
        ) : clients.length === 0 ? (
          <View className="flex-1 justify-center items-center text-center">
            <Users size={32} color="#737373" className="mb-2" />
            <Text className="text-sm text-neutral-500">{t.noClients}</Text>
          </View>
        ) : (
          <FlatList
            data={clients}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isClientActive = item.status === "ACTIVE";

              return (
                <View
                  className={`p-4 rounded-2xl border mb-3 flex-col gap-3.5 ${
                    isDark
                      ? "bg-neutral-900 border-neutral-800"
                      : "bg-white border-neutral-200"
                  }`}
                >
                  <View className="flex-row justify-between items-start">
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleCopyId(item.id)}
                    >
                      <Text
                        className={`text-base font-bold ${isDark ? "text-white" : "text-neutral-900"}`}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-[10px] text-neutral-400 mt-0.5">
                        {t.clientIdLabel || "ID"}: {item.id.substring(0, 8)}
                        ...
                      </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center gap-2">
                      <View
                        className={`px-2 py-0.5 rounded-full border ${
                          isClientActive
                            ? "bg-green-500/10 border-green-500/20"
                            : "bg-neutral-500/10 border-neutral-500/20"
                        }`}
                      >
                        <Text
                          className={`text-[8px] font-extrabold uppercase ${isClientActive ? "text-green-500" : "text-neutral-500"}`}
                        >
                          {isClientActive
                            ? t.clientStatusActive
                            : t.clientStatusInactive}
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

                  <View className="flex-col gap-2 border-t border-neutral-200/50 dark:border-neutral-800/50 pt-2.5">
                    {item.email && (
                      <View className="flex-row items-center gap-2">
                        <Mail size={12} color="#737373" />
                        <Text className="text-xs text-neutral-500 dark:text-neutral-400">
                          {item.email}
                        </Text>
                      </View>
                    )}

                    {item.phone && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleCall(item.phone!)}
                        className="flex-row items-center gap-2"
                      >
                        <Phone size={12} color="#10b981" />
                        <Text className="text-xs text-emerald-500 font-bold">
                          {item.phone}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {item.website && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleOpenUrl(item.website!)}
                        className="flex-row items-center gap-2"
                      >
                        <Globe size={12} color="#3b82f6" />
                        <Text className="text-xs text-blue-500 font-bold">
                          {item.website}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}

        {!isCreateSheetOpen && !isEditSheetOpen && (
          <TouchableOpacity
            onPress={handleOpenCreate}
            className={`absolute bottom-6 right-6 h-14 w-14 rounded-full justify-center items-center shadow-lg z-40 ${
              isDark ? "bg-neutral-100" : "bg-neutral-950"
            }`}
          >
            <Plus size={24} color={isDark ? "#0a0a0a" : "#ffffff"} />
          </TouchableOpacity>
        )}

        <CreateClientSheet
          ref={createSheetRef}
          onSuccess={() => {
            createSheetRef.current?.close();
            setIsCreateSheetOpen(false);
          }}
          onSubmitClient={handleCreateClient}
        />

        <EditClientSheet
          ref={editSheetRef}
          onSuccess={() => {
            editSheetRef.current?.close();
            setSelectedClient(null);
            setIsEditSheetOpen(false);
          }}
          client={selectedClient}
          onUpdateClient={handleUpdateClient}
          onDeleteClient={handleDeleteClient}
        />
      </View>

      <BottomTabBar />
    </View>
  );
}
