import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import i18n from "@/utils/languages/i18n";
import { store } from "@/store";
import { Provider, useDispatch } from "react-redux";
import { getAccessToken } from "@/utils/secure.store.helper";
import { setAccessToken } from "@/store/authSlice";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAccessToken();
  }, [segments]);

  const fetchAccessToken = async () => {
    const inAuthGroup = segments[0] === "auth";
    const accessToken = await getAccessToken();
    accessToken && dispatch(setAccessToken(accessToken));
    if (accessToken && inAuthGroup) {
      router.replace("/(drawer)");
    }
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          fullScreenGestureEnabled: true,
          headerBackTitle: i18n.t("back"),
          headerBackTitleVisible: true,
        }}
      >
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
