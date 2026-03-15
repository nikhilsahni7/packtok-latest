import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";

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
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import api from "../lib/api";

const blue_bg = require("@/assets/images/bubble 05.png");
const { width, height } = Dimensions.get("window");

const RESEND_COOLDOWN = 60;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Verify OTP mutation
  const verifyMutation = useMutation({
    mutationFn: async (otpValue: string) => {
      await api.post("/api/v1/auth/verify-otp", {
        email: (email || "").toLowerCase().trim(),
        otp: otpValue,
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Email Verified!",
        text2: "You can now sign in.",
        position: "top",
        visibilityTime: 3000,
      });
      router.replace("/login" as any);
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Verification failed. Please try again.";
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: message,
        position: "top",
        visibilityTime: 4000,
      });
    },
  });

  // Resend OTP mutation
  const resendMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/v1/auth/resend-otp", {
        email: (email || "").toLowerCase().trim(),
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: "A new OTP has been sent to your email.",
        position: "top",
        visibilityTime: 3000,
      });
      setResendCooldown(RESEND_COOLDOWN);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Failed to resend OTP.";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "top",
        visibilityTime: 4000,
      });
    },
  });

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      // Handle paste
      if (value.length > 1) {
        const digits = value.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < digits.length && index + i < 6; i++) {
          newOtp[index + i] = digits[i];
        }
        setOtp(newOtp);
        const nextIdx = Math.min(index + digits.length, 5);
        inputRefs.current[nextIdx]?.focus();
        return;
      }

      if (value && !/^\d$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handleVerify = useCallback(() => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter the complete 6-digit OTP.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    verifyMutation.mutate(otpValue);
  }, [otp, verifyMutation]);

  const handleResend = useCallback(() => {
    if (resendCooldown > 0 || resendMutation.isPending) return;
    resendMutation.mutate();
  }, [resendCooldown, resendMutation]);

  const maskedEmail =
    email && email.length > 5
      ? `${email.slice(0, 3)}...${email.slice(email.indexOf("@"))}`
      : email || "";

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Background Bubbles */}
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

      <ScrollView
        className="flex-1 relative z-20"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 px-8 pt-12">
          {/* Logo */}
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
              style={{ width: width * 2, height: height * 0.3 }}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Check your email
          </Text>
          <Text className="text-gray-500 mb-1">
            We sent a verification code to {maskedEmail}
          </Text>
          <Text className="text-gray-400 text-sm mb-8">
            Enter the 6-digit code mentioned in the email
          </Text>

          {/* OTP Inputs */}
          <View className="flex-row justify-between mb-8 px-2">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onChangeText={(value) => handleOtpChange(index, value)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(index, nativeEvent.key)
                }
                keyboardType="number-pad"
                maxLength={1}
                editable={!verifyMutation.isPending}
                className={`w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 bg-white ${
                  digit
                    ? "border-orange-400"
                    : "border-gray-200"
                }`}
                style={{ fontSize: 20 }}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={verifyMutation.isPending}
            className={`w-full rounded-2xl py-4 items-center justify-center ${
              verifyMutation.isPending ? "bg-gray-400" : "bg-black"
            }`}
            activeOpacity={0.8}
          >
            {verifyMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-[22px] font-light">Verify</Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP */}
          <View className="items-center mt-5">
            <Text className="text-gray-500 text-sm mb-1">
              Haven't got the email yet?
            </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={resendCooldown > 0 || resendMutation.isPending}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-medium ${
                  resendCooldown > 0
                    ? "text-gray-400"
                    : "text-orange-500"
                }`}
              >
                {resendMutation.isPending
                  ? "Sending..."
                  : resendCooldown > 0
                    ? `Resend OTP in ${resendCooldown}s`
                    : "Resend email"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center justify-center mt-6"
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={16} color="#6B7280" />
            <Text className="text-gray-500 text-sm ml-1">Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
