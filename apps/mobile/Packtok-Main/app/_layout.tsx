import "react-native-reanimated"; // ensure Reanimated is imported before anything using animations

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import "./global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { QueryProvider } from "../providers/QueryProvider";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // Protect routes based on auth state
  useProtectedRoute();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="welcome"
            options={{
              headerShown: false,
              gestureEnabled: false, // Prevent swipe back from welcome screens
            }}
          />
          <Stack.Screen
            name="welcome2"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="welcome3"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="auth-selection"
            options={{
              headerShown: false,
              gestureEnabled: false, // Prevent going back to welcome after reaching auth
            }}
          />
          <Stack.Screen
            name="signup-user"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="signup-vendor"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              gestureEnabled: false, // Prevent going back to auth screens after login
            }}
          />
          <Stack.Screen
            name="categories"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/turnkey-projects"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/turnkey-projects-form"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/maintenance"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/maintenance-form"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/consultancy"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/consultancy-form"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/sell-machine-form"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/investment-takeover"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/investment-takeover-form"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/sell-old-machine"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/machinery-installer"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="marketplace/machinery"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="marketplace/machinery/[id]"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="marketplace/spare-parts"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="marketplace/spare-parts/[id]"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="marketplace/consumables"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="marketplace/consumables/[id]"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="marketplace/raw-material"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="marketplace/raw-material/[id]"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="bidding"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="bidding/[id]"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="packaging"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="podcasts"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="podcasts/[id]"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/manpower"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="services/manpower-hiring-form"
            options={{
              headerShown: false,
              gestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="services/job-seeker-form"
            options={{
              headerShown: false,
              gestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="profile-edit"
            options={{
              headerShown: false,
              gestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="service-history"
            options={{
              headerShown: false,
              gestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="service-detail"
            options={{
              headerShown: false,
              gestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="quote-history"
            options={{
              headerShown: false,
              gestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="quote-detail"
            options={{
              headerShown: false,
              gestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="about"
            options={{
              headerShown: false,
              gestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="help-support"
            options={{
              headerShown: false,
              gestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Hide the splash screen immediately
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryProvider>
      <RootLayoutNav />
      <Toast />
    </QueryProvider>
  );
}
