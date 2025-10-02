import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function AuthSelectionScreen() {
  const router = useRouter();

  const handleUserSignup = () => {
    router.push("/signup-user" as any);
  };

  const handleVendorSignup = () => {
    router.push("/signup-vendor" as any);
  };

  const handleGetStarted = () => {
    router.push("/signup-user" as any);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Status Bar */}
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Background Bubbles */}
      {/* Orange Bubble - Top Left */}
      <Image
        source={require("@/assets/images/bubble 01.png")}
        className="absolute"
        style={{
          top: -width * 0.3,
          left: -width * 0.3,
          width: width * 0.7,
          height: width * 0.7,
        }}
        resizeMode="contain"
      />

      {/* Blue Bubble - Top Right */}
      <Image
        source={require("@/assets/images/bubble 02.png")}
        className="absolute"
        style={{
          top: -width * 0.2,
          right: -width * 0.35,
          width: width * 0.8,
          height: width * 0.8,
        }}
        resizeMode="contain"
      />

      {/* Main Content */}
      <View className="flex-1 items-center justify-between py-16">
        {/* Top Section - Image and Logo */}
        <View className="items-center mt-8">
          {/* Machinery Illustration */}
          <View
            className="items-center justify-center mb-4"
            style={{ width: width * 0.7, height: height * 0.3 }}
          >
            <Image
              source={require("@/assets/images/splash-screen-bg.png")}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          {/* Logo */}
          <View className="items-center">
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: width * 2, height: undefined, aspectRatio: 3 }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Bottom Section - Buttons */}
        <View className="w-full px-8">
          {/* SignUp as User Button */}
          <TouchableOpacity
            onPress={handleUserSignup}
            className="w-full bg-gray-100 rounded-2xl py-4 items-center justify-center mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-gray-400 text-base font-medium">
              SignUp as User
            </Text>
          </TouchableOpacity>

          {/* SignUp as Vendor Button */}
          <TouchableOpacity
            onPress={handleVendorSignup}
            className="w-full bg-gray-100 rounded-2xl py-4 items-center justify-center mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-gray-400 text-base font-medium">
              SignUp as Vendor
            </Text>
          </TouchableOpacity>

          {/* Let's get started Button */}
          <TouchableOpacity
            onPress={handleGetStarted}
            className="w-full bg-black rounded-2xl py-4 items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold">
              Let&apos;s get started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
