import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const blue_bg = require("@/assets/images/bubble 05.png");

const { width, height } = Dimensions.get("window");

export default function SignupUserScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    // Handle signup logic here
    console.log("Signup:", { name, email, phoneNumber, password });
  };

  const handleCancel = () => {
    router.back();
  };

  const handleLogin = () => {
    router.push("/login" as any);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Status Bar */}
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Background Bubbles */}
      {/* Orange Bubble - Top Left */}
      <Image
        source={require("@/assets/images/bubble 01.png")}
        className="absolute z-10"
        style={{
          top: -width * 0.1,
          left: -width * 0.25,
          width: width * 0.7,
          height: width * 0.9,
        }}
        resizeMode="contain"
      />

      {/* Blue Bubble - Top Right */}
      <Image
        source={require("@/assets/images/bubble 02.png")}
        className="absolute"
        style={{
          top: -width * 0.1,
          left: -width * 0.25,
          width: width * 1,
          height: width * 0.9,
        }}
        resizeMode="contain"
      />

      {/* Orange Bubble - Bottom Right */}
      <Image
        source={blue_bg}
        className="absolute"
        style={{
          bottom: -width * 0.25,
          right: -width * 0.33,
          width: width * 1.2,
          height: width * 1.1,
        }}
        resizeMode="contain"
      />

      {/* Main Content - Wrapped in KeyboardAvoidingView and ScrollView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-8 pt-36">
            {/* Top Image */}
            <View className="items-center justify-center mb-8">
              <Image
                source={require("@/assets/images/splash-screen-bg.png")}
                style={{
                  width: width * 0.8,
                  height: height * 0.2,
                }}
                resizeMode="contain"
              />
            </View>

            {/* Sign Up as User Title */}
            <Text className="text-3xl text-center font-bold text-[#202020] my-6">
              Sign Up as User
            </Text>

            {/* Input Fields */}
            <View className="space-y-4">
              {/* Name Input */}
              <TextInput
                placeholder="Your Name"
                value={name}
                onChangeText={setName}
                className="w-full bg-gray-50 rounded-2xl px-5 py-5 text-base text-gray-900"
                placeholderTextColor="#9CA3AF"
              />

              {/* Email Input */}
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full bg-gray-50 rounded-2xl px-5 py-5 text-base text-gray-900 mt-4"
                placeholderTextColor="#9CA3AF"
              />

              {/* Phone Number Input with Country Code */}
              <View className="flex-row items-center bg-gray-50 rounded-2xl px-5 py-5 mt-4">
                <Image
                  source={{ uri: "https://flagcdn.com/w40/in.png" }}
                  style={{ width: 28, height: 20 }}
                  resizeMode="contain"
                />
                <View className="w-px h-6 bg-gray-300 mx-3" />
                <TextInput
                  placeholder="Your number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  className="flex-1 text-base text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Password Input */}
              <View className="flex-row items-center bg-gray-50 rounded-2xl px-5 py-5 mt-4">
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 text-base text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignup}
              className="w-full bg-black rounded-2xl py-4 items-center justify-center mt-8"
              activeOpacity={0.8}
            >
              <Text className="text-white text-[22px] font-light">Sign Up</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={handleCancel}
              className="w-full items-center justify-center mt-4"
              activeOpacity={0.8}
            >
              <Text className="text-gray-600 text-base font-medium">
                Cancel
              </Text>
            </TouchableOpacity>

            {/* Already have account */}
            <TouchableOpacity
              onPress={handleLogin}
              className="flex-row items-center justify-center mt-4"
              activeOpacity={0.8}
            >
              <Text className="text-gray-600 text-[15px]">
                I already have an account{" "}
              </Text>
              <View className="bg-black rounded-full w-6 h-6 items-center justify-center">
                <Feather name="arrow-right" size={14} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
