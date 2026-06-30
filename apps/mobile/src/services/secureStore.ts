import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "freelanceos_user_jwt_token";

export const secureStore = {
  async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error("SecureStore Save Failed:", error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("SecureStore Get Failed:", error);
      return null;
    }
  },

  async deleteToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("SecureStore Delete Failed:", error);
    }
  },
};
