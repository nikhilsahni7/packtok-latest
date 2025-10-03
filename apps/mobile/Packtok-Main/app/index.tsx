import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Dimensions, Image, View } from "react-native";
import { useAuthStore } from "../store/auth-store";

const { width, height } = Dimensions.get("window");

const SPLASH_DURATION = 2000; // 2 seconds
const ONBOARDING_COMPLETE_KEY = "onboarding_completed";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for auth store to hydrate before navigation
    if (!hasHydrated) return;

    const checkOnboardingStatus = async () => {
      try {
        // Wait for splash duration
        await new Promise((resolve) => setTimeout(resolve, SPLASH_DURATION));

        // Check if user has completed onboarding (seen welcome screens)
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          ONBOARDING_COMPLETE_KEY
        );

        console.log("🔍 Navigation Check:", {
          isAuthenticated,
          hasCompletedOnboarding: !!hasCompletedOnboarding,
        });

        if (isAuthenticated) {
          // User is logged in, go directly to home
          console.log("✅ Logged in user → Home");
          router.replace("/(tabs)");
        } else if (!hasCompletedOnboarding) {
          // First time user, show welcome screens
          console.log("👋 New user → Welcome screens");
          router.replace("/welcome");
        } else {
          // Returning user but not logged in, skip to auth
          console.log("🔄 Returning user → Auth selection");
          router.replace("/auth-selection");
        }
      } catch (error) {
        console.error("Error checking onboarding:", error);
        // Fallback to welcome screen for safety
        router.replace("/welcome");
      }
    };

    checkOnboardingStatus();
  }, [router, isAuthenticated, hasHydrated]);

  return (
    <View className="flex-1 bg-white">
      {/* Status Bar */}
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Orange Bubble - Top Left */}
      <Image
        source={require("@/assets/images/bubble 01.png")}
        className="absolute z-10"
        style={{
          top: -width * 0.10,
          left: -width * 0.28,
          width: width * 0.9,
          height: width * 0.9,
        }}
        resizeMode="contain"
      />

      {/* Blue Bubble - Top Right */}
      <Image
        source={require("@/assets/images/bubble 02.png")}
        className="absolute"
        style={{
          top: -width * 0.10,
          left: -width * 0.18,
          width: width * 1,
          height: width * 0.9,
        }}
        resizeMode="contain"
      />

      {/* Orange Bubble - Bottom Right */}
      <Image
        source={require("@/assets/images/bubble 3.png")}
        className="absolute"
        style={{
          bottom: -width * 0.15,
          right: -width * 0.10,
          width: width * 0.7,
          height: width * 0.7,
        }}
        resizeMode="contain"
      />

      {/* Blue Bubble - Bottom Left */}
      <Image
        source={require("@/assets/images/bubble 4.png")}
        className="absolute"
        style={{
          bottom: -width * 0.12,
          right: -width * 0.15,
          width: width * 0.9,
          height: width * 0.7,
        }}
        resizeMode="contain"
      />

      {/* Main Content Container */}
      <View className="flex-1 items-center justify-center px-10">
        <View
          className="items-center justify-center mb-8"
          style={{ width: width * 0.8, height: height * 0.4 }}
        >
          <Image
            source={require("@/assets/images/splash-screen-bg.png")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        {/* Logo */}
        <View
          className="items-center justify-center"
          style={{ width: width * 0.8 }}
        >
          <Image
            source={require("@/assets/images/logo1.png")}
            style={{ width: "100%", height: undefined, aspectRatio: 3 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}
