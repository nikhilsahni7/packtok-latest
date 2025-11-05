import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const router = useRouter();

  const handleContactPress = async () => {
    const email = "hello@PackTok.com";
    const url = `mailto:${email}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3"
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">About </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Logo */}
        <View className="items-center justify-center py-12 bg-gradient-to-br from-orange-50 to-white">
          <View className="bg-white rounded-3xl items-center justify-center shadow-lg p-6 border border-gray-100">
            <Image
              source={require("@/assets/images/logo-removebg.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mt-6">PackTok</Text>
          <Text className="text-sm text-gray-500 mt-1">Version 1.0.0</Text>
        </View>

        {/* Description */}
        <View className="px-6 py-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            About PackTok
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-4">
            Packtok committed to delivering high-performance corrugated and
            packaging machine solution, whether you need advanced machinery,
            quality raw materials, or reliable spare parts. Our team is here to
            assist with product inquiries, custom quotes, technical support, and
            order tracking—anytime you need it.
          </Text>
          <Text className="text-base text-gray-700 leading-6 mb-4">
            We specialize in corrugated and packaging machinery, raw materials,
            and spare parts—providing high-quality, reliable solutions for
            manufacturers and businesses. Since 35 years, we&apos;ve been
            committed to delivering performance, precision, and dependable
            support to keep your operations running at their best.
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            If you need help or you have any questions, feel free to contact us
            by email:
          </Text>
          <TouchableOpacity
            onPress={handleContactPress}
            className="mt-2"
            activeOpacity={0.7}
          >
            <Text className="text-base text-[#FF8C42] font-semibold">
              Packtok01@gmail.com
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="px-6 py-8 mt-8 border-t border-gray-200">
          <Text className="text-center text-sm text-gray-500">
            © 2025 PackTok. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
