import * as React from "react";
import { View, Text } from "react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { useMobileTranslation } from "@/hooks/useMobileTranslation";
import { Cloud, CloudOff } from "lucide-react-native";

export const SyncStatus: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState<boolean>(true);
  const { t } = useMobileTranslation();

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOnline(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-row items-center bg-neutral-900 px-2.5 py-1.5 rounded-full border border-neutral-800">
      {isOnline ? (
        <View className="flex-row items-center">
          <Cloud size={14} color="#10b981" />
          <Text className="text-[10px] text-emerald-500 font-bold ml-1">
            {t.syncedLabel}
          </Text>
        </View>
      ) : (
        <View className="flex-row items-center">
          <CloudOff size={14} color="#737373" />
          <Text className="text-[10px] text-neutral-400 font-bold ml-1">
            {t.offlineLabel}
          </Text>
        </View>
      )}
    </View>
  );
};
