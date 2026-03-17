import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
const blue_bg = require("@/assets/images/bubble 05.png");

import {
  ActivityIndicator,
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
import Toast from "react-native-toast-message";
import { useLogin } from "../hooks/useLogin";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLogin();

  const handleLogin = () => {
    // Validation
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your email",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your password",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    // Call login API (normalize email to lowercase)
    login({ email: email.trim().toLowerCase(), password: password.trim() });
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password" as any);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleVendorSignin = () => {
    router.push("/vendor/signin" as any);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      style={{ flex: 1 }}
    >
      {/* Status Bar */}
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Background Bubbles */}
      {/* Orange Bubble - Top Left */}
      <Image
        source={require("@/assets/images/bubble 01.png")}
        className="absolute z-[3]"
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

      {/* Main Content with ScrollView */}
      <ScrollView
        className="flex-1 relative z-20"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 px-8 pt-12">
          {/* Logo Section */}
          <View className="items-center">
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: width * 1.8, height: undefined, aspectRatio: 3 }}
              resizeMode="contain"
            />
          </View>

          {/* Machinery Image */}
          <View
            className="items-center justify-center mb-6"
            style={{ height: height * 0.18 }}
          >
            <Image
              source={require("@/assets/images/hero_bg.png")}
              style={{
                width: width * 2,
                height: height * 0.3,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Sign In as User Title */}
          <Text className="text-3xl font-bold text-gray-900 my-6">
            Sign In as User
          </Text>

          {/* Input Fields */}
          <View className="space-y-4">
            {/* Email Input */}
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isPending}
              className="w-full bg-gray-50 rounded-full px-5 py-5 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
            />

            {/* Password Input */}
            <View className="flex-row items-center bg-gray-50 rounded-full px-5 py-5 mt-4">
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isPending}
                className="flex-1 text-base text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              className="self-end mt-2"
              activeOpacity={0.7}
            >
              <Text className="text-orange-500 text-sm font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isPending}
            className={`w-full rounded-2xl py-4 items-center justify-center mt-8 ${
              isPending ? "bg-gray-400" : "bg-black"
            }`}
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-[22px] font-light">Next</Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={handleCancel}
            className="w-full items-center justify-center mt-4 mb-8"
            activeOpacity={0.8}
          >
            <Text className="text-gray-600 text-base font-medium">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleVendorSignin}
            className="self-center"
            activeOpacity={0.7}
          >
            <Text className="text-sm text-gray-600">
              Are you a vendor?{" "}
              <Text className="text-orange-500 font-semibold">
                Sign In as Vendor
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
