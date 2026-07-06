import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "freelanceos_user_access_token";
const REFRESH_TOKEN_KEY = "freelanceos_user_refresh_token";

export const secureStore = {
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error("SecureStore Save Failed:", error);
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("SecureStore Get Access Token Failed:", error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("SecureStore Get Refresh Token Failed:", error);
      return null;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("SecureStore Clear Tokens Failed:", error);
    }
  },
};
