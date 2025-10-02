import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Dimensions, Image, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to welcome screen after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 bg-white">
      {/* Status Bar */}
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Orange Bubble - Top Left */}
      <Image
        source={require("@/assets/images/bubble 01.png")}
        className="absolute"
        style={{
          top: -width * 0.35,
          left: -width * 0.35,
          width: width * 0.8,
          height: width * 0.8,
        }}
        resizeMode="contain"
      />

      {/* Blue Bubble - Top Right */}
      <Image
        source={require("@/assets/images/bubble 02.png")}
        className="absolute"
        style={{
          top: -width * 0.25,
          right: -width * 0.4,
          width: width * 0.9,
          height: width * 0.9,
        }}
        resizeMode="contain"
      />

      {/* Orange Bubble - Bottom Right */}
      <Image
        source={require("@/assets/images/bubble 3.png")}
        className="absolute"
        style={{
          bottom: -width * 0.25,
          right: -width * 0.25,
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
          bottom: -width * 0.2,
          left: -width * 0.2,
          width: width * 0.6,
          height: width * 0.6,
        }}
        resizeMode="contain"
      />

      {/* Main Content Container */}
      <View className="flex-1 items-center justify-center px-10">
        {/* Machinery Illustration */}
        <View
          className="items-center justify-center mb-8"
          style={{ width: width * 0.9, height: height * 0.4 }}
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
            source={require("@/assets/images/logo.png")}
            style={{ width: "200%", height: undefined, aspectRatio: 3 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}
