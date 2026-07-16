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
import { router, useLocalSearchParams } from "expo-router";
import { secureStore } from "@/services/secureStore";
import * as Haptics from "expo-haptics";
import { KeyRound, ArrowLeft } from "lucide-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApp } from "@/context/AppContext";

export default function RegisterVerifyScreen() {
  const params = useLocalSearchParams();
  const email = (params?.email as string) || "";

  const { t, theme, setUser } = useApp();
  const systemTheme = useColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  const [verificationCode, setVerificationCode] = React.useState("");
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [isVerifying, setIsVerifying] = React.useState(false);

  const handleVerifyOtp = async () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) return;

    setIsVerifying(true);
    setOtpError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/register-verify`,
        {
          email: email,
          code: verificationCode.trim(),
        },
      );

      const { accessToken, refreshToken, user } = response.data;
      if (accessToken && refreshToken) {
        await secureStore.saveTokens(accessToken, refreshToken);
        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          setUser(user);
        }
        await AsyncStorage.removeItem("isAppLocked");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/home");
      }
    } catch (err: any) {
      setOtpError(
        err.response?.data?.message || "Invalid or expired verification code",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const dynamicText = isDark ? "#f5f5f5" : "#171717";

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
            {t.confirmEmailTitle || "Confirm Email"}
          </Text>
          <View className="w-10" />
        </View>

        <Text className="text-sm text-neutral-500 text-center px-4">
          {(
            t.confirmEmailDesc ||
            "We sent a 6-digit verification code to {email}"
          ).replace("{email}", email)}
        </Text>

        <View className="gap-y-4">
          <View
            className={`relative flex-row items-center border rounded-xl px-3 h-12 ${
              isDark
                ? "border-neutral-800 bg-neutral-900"
                : "border-neutral-300 bg-white"
            }`}
          >
            <KeyRound
              size={18}
              color="#737373"
              style={{ position: "absolute", left: 12 }}
            />
            <TextInput
              style={{ color: dynamicText, textAlign: "center" }}
              maxLength={6}
              keyboardType="number-pad"
              className="flex-1 font-bold tracking-widest text-sm h-full"
              placeholder="000000"
              placeholderTextColor="#525252"
              value={verificationCode}
              onChangeText={(val) =>
                setVerificationCode(val.replace(/\D/g, ""))
              }
              autoFocus
            />
          </View>

          {otpError && (
            <Text className="text-xs text-red-500 font-bold text-center">
              {otpError}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleVerifyOtp}
            disabled={isVerifying || verificationCode.length !== 6}
            style={{ opacity: verificationCode.length !== 6 ? 0.5 : 1 }}
            className={`rounded-xl h-12 justify-center items-center ${isDark ? "bg-neutral-100" : "bg-neutral-900"}`}
          >
            {isVerifying ? (
              <ActivityIndicator
                size="small"
                color={isDark ? "#0a0a0a" : "#ffffff"}
              />
            ) : (
              <Text
                className={`font-bold text-sm ${isDark ? "text-neutral-950" : "text-white"}`}
              >
                {t.confirmAccountButton}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
