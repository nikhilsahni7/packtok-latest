import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import Toast from "react-native-toast-message";
import {
  useConfirmPasswordReset,
  useRequestPasswordReset,
  useVerifyPasswordResetOtp,
} from "../hooks/useForgotPassword";

const blue_bg = require("@/assets/images/bubble 05.png");
const { width, height } = Dimensions.get("window");

type Step = "email" | "otp" | "password";

const RESEND_COOLDOWN = 60;

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(TextInput | null)[]>([]);

  const requestMutation = useRequestPasswordReset();
  const verifyMutation = useVerifyPasswordResetOtp();
  const confirmMutation = useConfirmPasswordReset();

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Email step
  const handleEmailSubmit = useCallback(() => {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your email.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter a valid email.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    requestMutation.mutate(email, {
      onSuccess: () => {
        setStep("otp");
        setResendCooldown(RESEND_COOLDOWN);
      },
    });
  }, [email, requestMutation]);

  // OTP handling
  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) {
        const digits = value.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < digits.length && index + i < 6; i++) {
          newOtp[index + i] = digits[i];
        }
        setOtp(newOtp);
        const nextIdx = Math.min(index + digits.length, 5);
        otpRefs.current[nextIdx]?.focus();
        return;
      }
      if (value && !/^\d$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleOtpKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handleOtpSubmit = useCallback(() => {
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
    verifyMutation.mutate(
      { email, otp: otpValue },
      {
        onSuccess: () => {
          setStep("password");
        },
      }
    );
  }, [otp, email, verifyMutation]);

  const handleResend = useCallback(() => {
    if (resendCooldown > 0 || requestMutation.isPending) return;
    requestMutation.mutate(email, {
      onSuccess: () => {
        setResendCooldown(RESEND_COOLDOWN);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      },
    });
  }, [resendCooldown, requestMutation, email]);

  // Password step
  const handlePasswordSubmit = useCallback(() => {
    if (!newPassword) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter a new password.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (newPassword.length < 8) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password must be at least 8 characters.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password must contain at least one lowercase letter.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password must contain at least one uppercase letter.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password must contain at least one number.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password must contain at least one special character.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Passwords do not match.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    confirmMutation.mutate(
      { email, otp: otp.join(""), newPassword },
      {
        onSuccess: () => {
          router.replace("/login" as any);
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || "";
          if (
            message.toLowerCase().includes("otp") ||
            message.toLowerCase().includes("invalid") ||
            message.toLowerCase().includes("expired")
          ) {
            setOtp(["", "", "", "", "", ""]);
            setStep("otp");
          }
        },
      }
    );
  }, [newPassword, confirmPassword, email, otp, confirmMutation, router]);

  const maskedEmail =
    email.length > 5
      ? `${email.slice(0, 3)}...${email.slice(email.indexOf("@"))}`
      : email;

  // Shared header with logo and image
  const renderHeader = (showImage: boolean = true) => (
    <>
      <View className="items-center">
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: width * 1.8, height: undefined, aspectRatio: 3 }}
          resizeMode="contain"
        />
      </View>
      {showImage && (
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
      )}
    </>
  );

  // Step 1: Email
  const renderEmailStep = () => (
    <>
      {renderHeader()}
      <Text className="text-3xl font-bold text-gray-900 mb-2">
        Forgot password
      </Text>
      <Text className="text-gray-500 mb-8">
        Please enter your email to reset the password
      </Text>

      <Text className="text-sm font-medium text-gray-700 mb-2">
        Your Email
      </Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!requestMutation.isPending}
        className="w-full bg-gray-50 rounded-full px-5 py-4 text-base text-gray-900 mb-8"
        placeholderTextColor="#9CA3AF"
      />

      <TouchableOpacity
        onPress={handleEmailSubmit}
        disabled={requestMutation.isPending}
        className={`w-full rounded-2xl py-4 items-center justify-center ${
          requestMutation.isPending ? "bg-gray-400" : "bg-black"
        }`}
        activeOpacity={0.8}
      >
        {requestMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-[22px] font-light">Next</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row items-center justify-center mt-5"
        activeOpacity={0.8}
      >
        <Feather name="arrow-left" size={16} color="#6B7280" />
        <Text className="text-gray-500 text-sm ml-1">Back to Sign In</Text>
      </TouchableOpacity>
    </>
  );

  // Step 2: OTP
  const renderOtpStep = () => (
    <>
      {renderHeader()}
      <Text className="text-3xl font-bold text-gray-900 mb-2">
        Check your email
      </Text>
      <Text className="text-gray-500 mb-1">
        We sent a reset link to {maskedEmail}
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
              otpRefs.current[index] = el;
            }}
            value={digit}
            onChangeText={(value) => handleOtpChange(index, value)}
            onKeyPress={({ nativeEvent }) =>
              handleOtpKeyPress(index, nativeEvent.key)
            }
            keyboardType="number-pad"
            maxLength={1}
            editable={!verifyMutation.isPending}
            className={`w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 bg-white ${
              digit ? "border-orange-400" : "border-gray-200"
            }`}
            style={{ fontSize: 20 }}
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={handleOtpSubmit}
        disabled={verifyMutation.isPending}
        className={`w-full rounded-2xl py-4 items-center justify-center ${
          verifyMutation.isPending ? "bg-gray-400" : "bg-black"
        }`}
        activeOpacity={0.8}
      >
        {verifyMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-[22px] font-light">Next</Text>
        )}
      </TouchableOpacity>

      {/* Resend */}
      <View className="items-center mt-5">
        <Text className="text-gray-500 text-sm mb-1">
          Haven't got the email yet?
        </Text>
        <TouchableOpacity
          onPress={handleResend}
          disabled={resendCooldown > 0 || requestMutation.isPending}
          activeOpacity={0.7}
        >
          <Text
            className={`text-sm font-medium ${
              resendCooldown > 0 ? "text-gray-400" : "text-orange-500"
            }`}
          >
            {requestMutation.isPending
              ? "Sending..."
              : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend email"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setStep("email")}
        className="flex-row items-center justify-center mt-4"
        activeOpacity={0.8}
      >
        <Feather name="arrow-left" size={16} color="#6B7280" />
        <Text className="text-gray-500 text-sm ml-1">Back</Text>
      </TouchableOpacity>
    </>
  );

  // Step 3: New Password
  const renderPasswordStep = () => (
    <>
      {renderHeader(false)}
      <Text className="text-3xl font-bold text-gray-900 mb-2">
        Set a new password
      </Text>
      <Text className="text-gray-500 mb-8">
        Create a new password. Ensure it differs from previous ones for security
      </Text>

      {/* Password */}
      <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
      <View className="flex-row items-center bg-gray-50 rounded-full px-5 py-4 mb-4">
        <TextInput
          placeholder="Enter your new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNew}
          editable={!confirmMutation.isPending}
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
          <Feather
            name={showNew ? "eye" : "eye-off"}
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <Text className="text-sm font-medium text-gray-700 mb-2">
        Confirm Password
      </Text>
      <View className="flex-row items-center bg-gray-50 rounded-full px-5 py-4 mb-8">
        <TextInput
          placeholder="Re-enter password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          editable={!confirmMutation.isPending}
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Feather
            name={showConfirm ? "eye" : "eye-off"}
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handlePasswordSubmit}
        disabled={confirmMutation.isPending}
        className={`w-full rounded-2xl py-4 items-center justify-center ${
          confirmMutation.isPending ? "bg-gray-400" : "bg-black"
        }`}
        activeOpacity={0.8}
      >
        {confirmMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-[22px] font-light">
            Update Password
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setStep("otp")}
        className="flex-row items-center justify-center mt-5"
        activeOpacity={0.8}
      >
        <Feather name="arrow-left" size={16} color="#6B7280" />
        <Text className="text-gray-500 text-sm ml-1">Back</Text>
      </TouchableOpacity>
    </>
  );

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
          {step === "email" && renderEmailStep()}
          {step === "otp" && renderOtpStep()}
          {step === "password" && renderPasswordStep()}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
