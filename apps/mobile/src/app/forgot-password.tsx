import * as React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import * as Haptics from "expo-haptics";
import {
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react-native";
import axios from "axios";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t, theme } = useApp();
  const systemTheme = useColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  const [step, setStep] = React.useState<"REQUEST" | "RESET">("REQUEST");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const handleRequestSubmit = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    setApiError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/reset-request`,
        { email: email.trim() },
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep("RESET");
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async () => {
    if (!code.trim() || code.length !== 6 || !newPassword.trim()) return;
    setIsLoading(true);
    setApiError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/reset-verify`,
        {
          email: email.trim(),
          code: code.trim(),
          newPassword: newPassword.trim(),
        },
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/login");
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={`flex-1 justify-center px-6 ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}
    >
      <View className="gap-y-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ backgroundColor: "#171717", borderColor: "#262626" }}
            className="h-10 w-10 border rounded-full items-center justify-center active:bg-neutral-800"
          >
            <ArrowLeft size={18} color="#a3a3a3" />
          </TouchableOpacity>
          <Text
            className={`text-lg font-black ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
          >
            {step === "REQUEST" ? t.forgotPasswordTitle : t.verifyCodeTitle}
          </Text>
          <View className="w-10" />
        </View>

        <Text className="text-sm text-neutral-500 text-center px-4">
          {step === "REQUEST"
            ? t.forgotPasswordDesc
            : t.verifyCodeDesc.replace("{email}", email)}
        </Text>

        {step === "REQUEST" ? (
          <View className="gap-y-4">
            <View
              className={`flex-row items-center border rounded-xl px-3 h-12 ${isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-300 bg-white"}`}
            >
              <Mail size={18} color="#737373" style={{ marginRight: 8 }} />
              <TextInput
                className={`flex-1 text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                placeholder="you@example.com"
                placeholderTextColor="#525252"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {apiError && (
              <Text className="text-xs text-red-500 font-bold text-center">
                {apiError}
              </Text>
            )}

            <TouchableOpacity
              onPress={handleRequestSubmit}
              disabled={isLoading || !email.trim()}
              className={`rounded-xl h-12 justify-center items-center mt-2 ${isDark ? "bg-neutral-100" : "bg-neutral-900"}`}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isDark ? "#0a0a0a" : "#ffffff"}
                />
              ) : (
                <Text
                  className={`font-bold text-sm ${isDark ? "text-neutral-950" : "text-white"}`}
                >
                  {t.sendCodeButton}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-y-4 gap-2">
            <View
              className={`flex-row items-center border rounded-xl px-3 h-12 ${isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-300 bg-white"}`}
            >
              <KeyRound size={18} color="#737373" style={{ marginRight: 8 }} />
              <TextInput
                maxLength={6}
                keyboardType="number-pad"
                className={`flex-1 text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                placeholder="000000"
                placeholderTextColor="#525252"
                value={code}
                onChangeText={(val) => setCode(val.replace(/\D/g, ""))}
              />
            </View>

            <View
              className={`flex-row items-center border rounded-xl px-3 h-12 ${isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-300 bg-white"}`}
            >
              <Lock size={18} color="#737373" style={{ marginRight: 8 }} />
              <TextInput
                className={`flex-1 text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                placeholder="••••••••"
                placeholderTextColor="#525252"
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} color="#737373" />
                ) : (
                  <Eye size={18} color="#737373" />
                )}
              </TouchableOpacity>
            </View>

            {apiError && (
              <Text className="text-xs text-red-500 font-bold text-center">
                {apiError}
              </Text>
            )}

            <TouchableOpacity
              onPress={handleResetSubmit}
              disabled={
                isLoading || code.length !== 6 || newPassword.length < 6
              }
              className={`rounded-xl h-12 justify-center items-center mt-2 ${isDark ? "bg-neutral-100" : "bg-neutral-900"}`}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isDark ? "#0a0a0a" : "#ffffff"}
                />
              ) : (
                <Text
                  className={`font-bold text-sm ${isDark ? "text-neutral-950" : "text-white"}`}
                >
                  {t.forgotPasswordTitle}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
