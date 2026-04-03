import { Feather } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js/min";
import { useMemo, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import api from "../lib/api";
const blue_bg = require("@/assets/images/bubble 05.png");

const { width, height } = Dimensions.get("window");

const COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳", dial: "+91" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", dial: "+966" },
  { code: "US", name: "United States", flag: "🇺🇸", dial: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dial: "+44" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dial: "+1" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dial: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", dial: "+33" },
  { code: "IT", name: "Italy", flag: "🇮🇹", dial: "+39" },
  { code: "ES", name: "Spain", flag: "🇪🇸", dial: "+34" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", dial: "+31" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", dial: "+90" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", dial: "+20" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", dial: "+254" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", dial: "+234" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", dial: "+92" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", dial: "+880" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", dial: "+94" },
  { code: "NP", name: "Nepal", flag: "🇳🇵", dial: "+977" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", dial: "+60" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", dial: "+65" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", dial: "+66" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", dial: "+62" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", dial: "+84" },
  { code: "CN", name: "China", flag: "🇨🇳", dial: "+86" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dial: "+81" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", dial: "+82" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dial: "+61" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", dial: "+64" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", dial: "+55" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", dial: "+52" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", dial: "+54" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", dial: "+27" },
];

const validatePhoneNumber = (
  localPhone: string,
  dialCode: string,
  countryCode: string,
): string | null => {
  if (!localPhone.trim()) return null; // phone is optional

  const digitsOnly = localPhone.replace(/\D/g, "");
  if (!digitsOnly) return null;

  const normalizedCountry = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalizedCountry)) {
    return "Please select a valid country for phone number";
  }

  const e164 = `${dialCode}${digitsOnly}`;
  const parsed = parsePhoneNumberFromString(
    e164,
    normalizedCountry as CountryCode,
  );

  if (!parsed || !parsed.isValid()) {
    return "Please enter a valid phone number for the selected country";
  }

  if (normalizedCountry === "IN" && parsed.nationalNumber.length !== 10) {
    return "Indian mobile number must be exactly 10 digits";
  }

  return null;
};

export default function SignupVendorScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES.find((c) => c.code === "IN") || COUNTRIES[0],
  );
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [notes, setNotes] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const filteredCountries = useMemo(() => {
    const search = countrySearch.trim().toLowerCase();
    if (!search) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.code.toLowerCase().includes(search),
    );
  }, [countrySearch]);

  const signupVendorMutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      phone_number?: string;
      country: string;
      password: string;
      companyName: string;
      notes?: string;
    }) => {
      await api.post("/api/v1/auth/signup-vendor", payload);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: "Check your email for OTP verification code.",
        position: "top",
        visibilityTime: 4000,
      });
      router.push({
        pathname: "/verify-otp" as any,
        params: { email: email.trim().toLowerCase(), type: "vendor" },
      });
    },
    onError: (err: any) => {
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2:
          err?.response?.data?.message || "Unable to create vendor account.",
        position: "top",
        visibilityTime: 4000,
      });
    },
  });

  const handleSignup = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Full name is required",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (name.trim().length < 2) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Name must be at least 2 characters",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (!companyName.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Company name is required",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (!normalizedEmail) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Email is required",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (!/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(normalizedEmail)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter a valid email",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (!selectedCountry || !/^[A-Z]{2}$/.test(selectedCountry.code)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please select a valid country",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    const phoneError = validatePhoneNumber(
      phoneNumber,
      selectedCountry.dial,
      selectedCountry.code,
    );
    if (phoneError) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: phoneError,
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (notes.trim().length > 2000) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Notes cannot exceed 2000 characters",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (password.length < 8) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password must be at least 8 characters",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2:
          "Password must include upper, lower, number, and special character",
        position: "top",
        visibilityTime: 3500,
      });
      return;
    }
    if (!agreeToTerms) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please agree to Terms and Privacy Policy",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    const digits = phoneNumber.replace(/\D/g, "");
    const phone_number = digits
      ? `${selectedCountry.dial}${digits}`.replace(/\+\+/, "+")
      : undefined;

    signupVendorMutation.mutate({
      name: name.trim(),
      companyName: companyName.trim(),
      email: normalizedEmail,
      phone_number,
      country: selectedCountry.code,
      password,
      notes: notes.trim() || undefined,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const handleLogin = () => {
    router.push("/vendor/signin" as any);
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
          left: -width * 0.26,
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
          left: -width * 0.26,
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

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 32,
          paddingTop: 120,
          paddingBottom: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Image */}
        <View
          className="items-center justify-center mb-8"
          style={{ height: height * 0.2 }}
        >
          <Image
            source={require("@/assets/images/splash-screen-bg.png")}
            style={{
              width: width * 1.3,
              height: height * 0.3,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Sign Up as Vendor Title */}
        <Text className="text-3xl text-center font-bold text-[#202020] my-6">
          Sign Up as Vendor
        </Text>

        {/* Input Fields */}
        <View className="space-y-4">
          {/* Full Name Input */}
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            className="w-full bg-gray-50 rounded-full px-5 py-5 text-base text-gray-900"
            placeholderTextColor="#9CA3AF"
          />

          {/* Business Name Input */}
          <TextInput
            placeholder="Company Name"
            value={companyName}
            onChangeText={setCompanyName}
            className="w-full bg-gray-50 rounded-full px-5 py-5 text-base text-gray-900 mt-4"
            placeholderTextColor="#9CA3AF"
          />

          {/* Email Input */}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full bg-gray-50 rounded-full px-5 py-5 text-base text-gray-900 mt-4"
            placeholderTextColor="#9CA3AF"
          />

          {/* Phone Number Input with Country Dial Code */}
          <View className="flex-row items-center bg-gray-50 rounded-full px-5 py-5 mt-4">
            <Text style={{ fontSize: 18 }}>{selectedCountry.flag}</Text>
            <Text className="text-gray-700 text-sm ml-2">
              {selectedCountry.dial}
            </Text>
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

          {/* Country Picker */}
          <TouchableOpacity
            onPress={() => setShowCountryModal(true)}
            className="w-full bg-gray-50 rounded-full px-5 py-5 mt-4 flex-row items-center justify-between"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center flex-1 pr-3">
              <Text style={{ fontSize: 18 }}>{selectedCountry.flag}</Text>
              <Text className="ml-3 text-base text-gray-900" numberOfLines={1}>
                {selectedCountry.name} ({selectedCountry.code})
              </Text>
            </View>
            <Feather name="chevron-down" size={18} color="#6B7280" />
          </TouchableOpacity>

          {/* Notes Input */}
          <TextInput
            placeholder="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-base text-gray-900 mt-4"
            placeholderTextColor="#9CA3AF"
            style={{ textAlignVertical: "top" }}
          />

          {/* Password Input */}
          <View className="flex-row items-center bg-gray-50 rounded-full px-5 py-5 mt-4">
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
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

          {/* Terms Checkbox */}
          <TouchableOpacity
            onPress={() => setAgreeToTerms((prev) => !prev)}
            activeOpacity={0.8}
            className="flex-row items-start mt-4"
          >
            <View
              className={`w-5 h-5 rounded border mt-0.5 items-center justify-center ${agreeToTerms ? "bg-black border-black" : "bg-white border-gray-300"}`}
            >
              {agreeToTerms ? (
                <Feather name="check" size={12} color="white" />
              ) : null}
            </View>
            <Text className="text-xs text-gray-600 ml-3 flex-1 leading-5">
              I agree to the Terms of Service and Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={signupVendorMutation.isPending}
          className={`w-full rounded-2xl py-4 items-center justify-center mt-8 ${signupVendorMutation.isPending ? "bg-gray-400" : "bg-black"}`}
          activeOpacity={0.8}
        >
          {signupVendorMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-[22px] font-light">Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={handleCancel}
          className="w-full items-center justify-center mt-4"
          activeOpacity={0.8}
        >
          <Text className="text-gray-600 text-base font-medium">Cancel</Text>
        </TouchableOpacity>

        {/* Already have account */}
        <TouchableOpacity
          onPress={handleLogin}
          className="flex-row items-center justify-center mt-4"
          activeOpacity={0.8}
        >
          <Text className="text-gray-600 text-sm">
            I already have an account{" "}
          </Text>
          <View className="bg-black rounded-full w-6 h-6 items-center justify-center">
            <Feather name="arrow-right" size={14} color="white" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View className="flex-1 bg-white">
          <View className="px-5 pt-12 pb-4 border-b border-gray-200 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">
              Select Country
            </Text>
            <TouchableOpacity
              onPress={() => setShowCountryModal(false)}
              className="w-10 h-10 items-center justify-center"
            >
              <Feather name="x" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          <View className="px-5 py-3">
            <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
              <Feather name="search" size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Search country"
                value={countrySearch}
                onChangeText={setCountrySearch}
                className="flex-1 ml-2 text-base text-gray-900"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
              />
            </View>
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCountry(item);
                  setShowCountryModal(false);
                  setCountrySearch("");
                }}
                className="px-5 py-4 border-b border-gray-100 flex-row items-center"
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                <View className="ml-3 flex-1">
                  <Text className="text-base text-gray-900">{item.name}</Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {item.code} {item.dial}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <Text className="text-sm text-gray-500">No country found</Text>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
}
