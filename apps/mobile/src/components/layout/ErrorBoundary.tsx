import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  NativeModules,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMobileTranslation } from "@/hooks/useMobileTranslation";
import { RefreshCw, ShieldAlert } from "lucide-react-native";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Critical mobile runtime error caught:", error, errorInfo);
  }

  private handleResetApp = async () => {
    try {
      await AsyncStorage.clear();
      NativeModules.DevSettings?.reload();
    } catch {
      this.setState({ hasError: false });
    }
  };

  public render() {
    if (this.state.hasError) {
      return <FallbackScreen onReset={this.handleResetApp} />;
    }
    return this.props.children;
  }
}

const FallbackScreen: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { t } = useMobileTranslation();

  return (
    <View
      className={`flex-1 justify-center items-center px-6 ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}
    >
      <View className="items-center space-y-4">
        <View className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-full justify-center items-center mb-4">
          <ShieldAlert size={32} color="#ef4444" />
        </View>

        <Text
          className={`text-xl font-black text-center ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
        >
          {t.errorBoundaryTitle}
        </Text>

        <Text className="text-xs text-neutral-500 text-center max-w-xs mb-8">
          {t.errorBoundaryDesc}
        </Text>

        <TouchableOpacity
          onPress={onReset}
          className={`flex-row items-center justify-center px-6 h-12 rounded-xl border ${
            isDark
              ? "bg-neutral-100 border-neutral-100 active:bg-neutral-200"
              : "bg-neutral-950 border-neutral-900 active:bg-neutral-800"
          }`}
        >
          <RefreshCw
            size={16}
            color={isDark ? "#0a0a0a" : "#ffffff"}
            style={{ marginRight: 8 }}
          />
          <Text
            className={`text-sm font-bold ${isDark ? "text-neutral-950" : "text-white"}`}
          >
            {t.errorBoundaryReset}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
