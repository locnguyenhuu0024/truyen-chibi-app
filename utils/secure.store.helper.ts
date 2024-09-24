import { Token, User } from "@/types/auth";
import * as SecureStore from "expo-secure-store";

export const saveUserData = async (
  user: User | null,
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  try {
    user && (await SecureStore.setItemAsync("user", JSON.stringify(user)));
    accessToken && (await SecureStore.setItemAsync("accessToken", accessToken));
    refreshToken &&
      (await SecureStore.setItemAsync("refreshToken", refreshToken));
    console.log("User data saved successfully");
  } catch (error) {
    console.error("Error saving user data", error);
    throw new Error("Failed to save user data");
  }
};

export const getUserData = async (): Promise<{
  user: User;
  accessToken: string | null;
  refreshToken: string | null;
}> => {
  try {
    const user = await SecureStore.getItemAsync("user");
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    return {
      user: user ? JSON.parse(user) : null,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error retrieving user data", error);
    throw new Error("Failed to retrieve user data");
  }
};

export const deleteUserData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    console.log("User data deleted successfully");
  } catch (error) {
    console.error("Error deleting user data", error);
    throw new Error("Failed to delete user data");
  }
};

export const getUser = async (): Promise<User> => {
  const user = (await SecureStore.getItemAsync("user")) || "{}";
  return JSON.parse(user);
};

export const getAccessToken = async (): Promise<string | null> => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  return accessToken;
};

export const getRefreshToken = async (): Promise<string | null> => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  return refreshToken;
};

export const refreshAccessToken = async (newTokens: Token): Promise<void> => {
  try {
    await saveUserData(null, newTokens.access_token, newTokens.refresh_token); // Save the new tokens
  } catch (error) {
    console.error("Error refreshing access token", error);
    throw new Error("Failed to refresh access token");
  }
};
