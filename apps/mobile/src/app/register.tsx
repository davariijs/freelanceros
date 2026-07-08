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
import * as Haptics from "expo-haptics";
import { Lock, Mail, User, Eye, EyeOff, Globe } from "lucide-react-native";
import axios from "axios";
import { useApp } from "@/context/AppContext";
import * as WebBrowser from "expo-web-browser";

export default function RegisterScreen() {
  const router = useRouter();
  const { t, theme } = useApp();
  const systemTheme = useColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
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
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/register-request`,
        data,
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      router.push({
        pathname: "/register-verify",
        params: { email: data.email },
      });
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setApiError(
        err.response?.data?.message === "User already exists"
          ? t.errorUserExists
          : err.response?.data?.message || err.message || "Registration failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const googleClientId =
      Platform.OS === "android"
        ? process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID
        : process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS;

    try {
      await WebBrowser.openAuthSessionAsync(
        `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${googleClientId}&scope=email%20profile`,
        "freelanceos://",
      );
    } catch (error) {
      console.error("Google Auth failed:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={`flex-1 justify-center px-6 ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`}
    >
      <View className="gap-y-6">
        <View className="items-center">
          <Text
            className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
          >
            {t.welcomeTitle}
          </Text>
          <Text className="text-sm text-neutral-500 mt-2 text-center">
            {t.signupDescription}
          </Text>
        </View>

        <View className="gap-y-4">
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
        <TouchableOpacity
          onPress={handleGoogleLogin}
          disabled={isGoogleLoading}
          className={`rounded-xl h-12 flex-row justify-center items-center border ${isDark ? "border-neutral-800 bg-neutral-900 active:bg-neutral-800" : "border-neutral-300 bg-white active:bg-neutral-100"}`}
        >
          {isGoogleLoading ? (
            <ActivityIndicator size="small" color="#737373" />
          ) : (
            <>
              <Globe
                size={16}
                color={isDark ? "#f5f5f5" : "#171717"}
                style={{ marginRight: 8 }}
              />
              <Text
                className={`font-bold text-sm ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
              >
                {t.continueWithGoogle}
              </Text>
            </>
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
