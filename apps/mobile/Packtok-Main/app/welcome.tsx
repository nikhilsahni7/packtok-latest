import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/welcome2");
  };

  const handleSkip = () => {
    router.push("/(tabs)");
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
          top: -width * 0.25,
          left: -width * 0.25,
          width: width * 0.6,
          height: width * 0.6,
        }}
        resizeMode="contain"
      />

      {/* Blue Bubble - Top Right */}
      <Image
        source={require("@/assets/images/bubble 02.png")}
        className="absolute"
        style={{
          top: -width * 0.15,
          right: -width * 0.3,
          width: width * 0.7,
          height: width * 0.7,
        }}
        resizeMode="contain"
      />

      {/* Orange Bubble - Bottom Right */}
      <Image
        source={require("@/assets/images/bubble 3.png")}
        className="absolute"
        style={{
          bottom: -width * 0.2,
          right: -width * 0.2,
          width: width * 0.55,
          height: width * 0.55,
        }}
        resizeMode="contain"
      />

      {/* Skip Button */}
      <View className="absolute top-12 right-6 z-10">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-base font-semibold text-gray-800">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Page Indicator Dots */}
      <View className="absolute top-16 left-6 flex-row items-center gap-2 z-10">
        <View className="w-8 h-1 bg-black rounded-full" />
        <View className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
        <View className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Image Container with Background */}
        <View
          className="mb-8"
          style={{
            width: width * 0.85,
            height: height * 0.45,
            position: "relative",
          }}
        >
          {/* Black Right Effect Background - Positioned on the right
          <Image
            source={require("@/assets/images/black-right-effect.png")}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: width * 0.45,
              height: height * 0.45,
            }}
            resizeMode="contain"
          /> */}

          {/* Welcome Person Image - Centered */}
          <View className="absolute inset-0 items-center justify-center">
            <Image
              source={require("@/assets/images/welcome-bg.png")}
              style={{
                width: width * 0.7,
                height: height * 0.4,
              }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Welcome Text */}
        <Text className="text-3xl font-bold text-center text-gray-900 mb-4">
          Welcome to Packtok
        </Text>

        {/* Description Text */}
        <Text className="text-base text-center text-gray-600 leading-6 px-4 mb-10">
          Discover a world of convenience and reliability. PackTok is your one
          stop solution for all your home service needs
        </Text>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="w-[85%] bg-black rounded-2xl py-4 items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
