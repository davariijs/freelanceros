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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, Link } from "expo-router";
import { secureStore } from "@/services/secureStore";
import * as Haptics from "expo-haptics";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApp } from "@/context/AppContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { t, theme } = useApp();
  const systemTheme = useColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const registerSchema = z.object({
    name: z
      .string()
      .min(2, t.nameRequired || "Name must be at least 2 characters"),
    email: z.string().email(t.emailRequired),
    password: z.string().min(6, t.passwordRequired),
  });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setApiError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/register`,
        data,
      );

      const { accessToken, refreshToken } = response.data;
      if (accessToken && refreshToken) {
        await secureStore.saveTokens(accessToken, refreshToken);
        await AsyncStorage.removeItem("isAppLocked");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/home");
      } else {
        throw new Error("Invalid token payload received from server");
      }
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setApiError(
        err.response?.data?.message || err.message || "Registration failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={`flex-1 justify-center px-6 ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}
    >
      <View className="space-y-6">
        <View className="items-center mb-6">
          <Text
            className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
          >
            {t.welcomeTitle}
          </Text>
          <Text className="text-sm text-neutral-500 mt-2 text-center">
            {t.signupDescription}
          </Text>
        </View>

        <View className="space-y-4 gap-2">
          <View>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`flex-row items-center border rounded-xl px-3 h-12 ${isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-300 bg-white"}`}
                >
                  <User size={18} color="#737373" style={{ marginRight: 8 }} />
                  <TextInput
                    className={`flex-1 text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                    placeholder="John Doe"
                    placeholderTextColor="#525252"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.name && (
              <Text className="text-xs text-red-500 mt-1 font-semibold">
                {errors.name.message}
              </Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`flex-row items-center border rounded-xl px-3 h-12 ${isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-300 bg-white"}`}
                >
                  <Mail size={18} color="#737373" style={{ marginRight: 8 }} />
                  <TextInput
                    className={`flex-1 text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                    placeholder="you@example.com"
                    placeholderTextColor="#525252"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text className="text-xs text-red-500 mt-1 font-semibold">
                {errors.email.message}
              </Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`flex-row items-center border rounded-xl px-3 h-12 ${isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-300 bg-white"}`}
                >
                  <Lock size={18} color="#737373" style={{ marginRight: 8 }} />
                  <TextInput
                    className={`flex-1 text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
                    placeholder="••••••••"
                    placeholderTextColor="#525252"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color="#737373" />
                    ) : (
                      <Eye size={18} color="#737373" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text className="text-xs text-red-500 mt-1 font-semibold">
                {errors.password.message}
              </Text>
            )}
          </View>
        </View>

        {apiError && (
          <Text className="text-xs text-red-500 font-bold text-center mt-2">
            {apiError}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className={`rounded-xl h-12 justify-center items-center mt-4 ${isDark ? "bg-neutral-100 active:bg-neutral-200" : "bg-neutral-900 active:bg-neutral-800"}`}
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
              {t.signUpButton}
            </Text>
          )}
        </TouchableOpacity>

        <View className="items-center mt-6">
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text className="text-xs text-neutral-500 underline">
                {t.hasAccount}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
