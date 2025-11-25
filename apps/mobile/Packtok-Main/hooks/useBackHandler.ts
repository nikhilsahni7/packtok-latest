import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { BackHandler, Platform } from "react-native";
import { useAuthStore } from "../store/auth-store";

/**
 * Hook to handle Android back button press
 * Prevents going back to auth screens when logged in
 */
export function useBackHandler(screen: string) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") return;

      const onBackPress = () => {
        // If on home screen and logged in, exit app instead of going back
        if (screen === "home" && isAuthenticated) {
          BackHandler.exitApp();
          return true;
        }

        // If on auth screens and logged in, block back navigation
        const authScreens = ["login", "signup", "auth-selection"];
        if (authScreens.includes(screen) && isAuthenticated) {
          router.replace("/(tabs)");
          return true;
        }

        // Default behavior
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [screen, isAuthenticated, router])
  );
}
