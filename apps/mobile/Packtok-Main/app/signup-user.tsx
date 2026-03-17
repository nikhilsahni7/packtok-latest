import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSignup } from "../hooks/useSignup";

const blue_bg = require("@/assets/images/bubble 05.png");
const { width, height } = Dimensions.get("window");

// Country data with dial codes and flag emojis
const COUNTRIES = [
  { code: "AF", name: "Afghanistan", dial: "+93", flag: "🇦🇫" },
  { code: "AL", name: "Albania", dial: "+355", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", dial: "+213", flag: "🇩🇿" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "AT", name: "Austria", dial: "+43", flag: "🇦🇹" },
  { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
  { code: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪" },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴" },
  { code: "CZ", name: "Czech Republic", dial: "+420", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰" },
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { code: "ET", name: "Ethiopia", dial: "+251", flag: "🇪🇹" },
  { code: "FI", name: "Finland", dial: "+358", flag: "🇫🇮" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
  { code: "GR", name: "Greece", dial: "+30", flag: "🇬🇷" },
  { code: "HK", name: "Hong Kong", dial: "+852", flag: "🇭🇰" },
  { code: "HU", name: "Hungary", dial: "+36", flag: "🇭🇺" },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  { code: "IR", name: "Iran", dial: "+98", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", dial: "+964", flag: "🇮🇶" },
  { code: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪" },
  { code: "IL", name: "Israel", dial: "+972", flag: "🇮🇱" },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { code: "JO", name: "Jordan", dial: "+962", flag: "🇯🇴" },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷" },
  { code: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
  { code: "MA", name: "Morocco", dial: "+212", flag: "🇲🇦" },
  { code: "MM", name: "Myanmar", dial: "+95", flag: "🇲🇲" },
  { code: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵" },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { code: "NO", name: "Norway", dial: "+47", flag: "🇳🇴" },
  { code: "OM", name: "Oman", dial: "+968", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { code: "PE", name: "Peru", dial: "+51", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { code: "PL", name: "Poland", dial: "+48", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { code: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦" },
  { code: "RO", name: "Romania", dial: "+40", flag: "🇷🇴" },
  { code: "RU", name: "Russia", dial: "+7", flag: "🇷🇺" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰" },
  { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
  { code: "TW", name: "Taiwan", dial: "+886", flag: "🇹🇼" },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { code: "UA", name: "Ukraine", dial: "+380", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳" },
];

// Validation helpers
const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Password must contain at least one special character";
  return null;
};

const validatePhoneNumber = (phone: string): string | null => {
  if (!phone.trim()) return null; // phone is optional
  // Strip the dial code prefix — validate the local number part
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 4 || digitsOnly.length > 15)
    return "Please enter a valid phone number";
  return null;
};

export default function SignupUserScreen() {
  const router = useRouter();
  const { mutate: signup, isPending } = useSignup();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Country selection
  const [selectedCountry, setSelectedCountry] = useState<
    (typeof COUNTRIES)[0] | null
  >(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // Phone dial code selection
  const [selectedDialCountry, setSelectedDialCountry] = useState(
    COUNTRIES.find((c) => c.code === "IN")!
  );
  const [showDialCodeModal, setShowDialCodeModal] = useState(false);
  const [dialCodeSearch, setDialCodeSearch] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCountries = useMemo(() => {
    const search = countrySearch.toLowerCase();
    if (!search) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.code.toLowerCase().includes(search)
    );
  }, [countrySearch]);

  const filteredDialCountries = useMemo(() => {
    const search = dialCodeSearch.toLowerCase();
    if (!search) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.dial.includes(search) ||
        c.code.toLowerCase().includes(search)
    );
  }, [dialCodeSearch]);

  const handleSignup = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    else if (name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) newErrors.phone = phoneError;

    if (!selectedCountry) newErrors.country = "Please select a country";

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (!agreeToTerms) newErrors.terms = "You must agree to the terms";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Show first error as toast
      const firstError = Object.values(newErrors)[0];
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: firstError,
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    // Build phone number in E.164 format
    let phone_number: string | undefined;
    if (phoneNumber.trim()) {
      const cleanDigits = phoneNumber.replace(/\D/g, "");
      phone_number = `${selectedDialCountry.dial}${cleanDigits}`;
    }

    signup({
      name: name.trim(),
      email: email.trim(),
      phone_number,
      country: selectedCountry!.code,
      password,
    });
  }, [
    name,
    email,
    phoneNumber,
    password,
    agreeToTerms,
    selectedCountry,
    selectedDialCountry,
    signup,
  ]);

  const handleCancel = () => {
    router.back();
  };

  const handleLogin = () => {
    router.push("/login" as any);
  };

  const renderCountryItem = useCallback(
    ({
      item,
      onSelect,
      showDial,
    }: {
      item: (typeof COUNTRIES)[0];
      onSelect: (c: (typeof COUNTRIES)[0]) => void;
      showDial?: boolean;
    }) => (
      <TouchableOpacity
        onPress={() => onSelect(item)}
        className="flex-row items-center px-5 py-4 border-b border-gray-100"
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 24 }}>{item.flag}</Text>
        <Text className="flex-1 ml-3 text-base text-gray-900">{item.name}</Text>
        {showDial && <Text className="text-gray-500 text-sm">{item.dial}</Text>}
        <Text className="text-gray-400 text-sm ml-2">({item.code})</Text>
      </TouchableOpacity>
    ),
    []
  );

  const renderPickerModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    search: string,
    setSearch: (s: string) => void,
    data: typeof COUNTRIES,
    onSelect: (c: (typeof COUNTRIES)[0]) => void,
    showDial: boolean
  ) => (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-3 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">{title}</Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 items-center justify-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Feather name="x" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="px-5 py-3">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
            <Feather name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
              className="flex-1 ml-2 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Feather name="x-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* List */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) =>
            renderCountryItem({ item, onSelect, showDial })
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Background Bubbles */}
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

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 relative z-20"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-8 pt-16">
            {/* Logo */}
            <View className="items-center">
              <Image
                source={require("@/assets/images/logo.png")}
                style={{
                  width: width * 1.4,
                  height: undefined,
                  aspectRatio: 3,
                }}
                resizeMode="contain"
              />
            </View>

            {/* Machinery Image */}
            <View
              className="items-center justify-center mb-4"
              style={{ height: height * 0.14 }}
            >
              <Image
                source={require("@/assets/images/hero_bg.png")}
                style={{ width: width * 1.6, height: height * 0.22 }}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-gray-900 mb-5 text-center">
              Sign Up as User
            </Text>

            {/* Form Fields */}
            <View>
              {/* Name */}
              <TextInput
                placeholder="Your Name"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (errors.name) setErrors((e) => ({ ...e, name: "" }));
                }}
                editable={!isPending}
                className={`w-full bg-gray-50 rounded-2xl px-5 py-4 text-base text-gray-900 ${errors.name ? "border border-red-400" : ""}`}
                placeholderTextColor="#9CA3AF"
              />
              {errors.name ? (
                <Text className="text-red-500 text-xs mt-1 ml-2">
                  {errors.name}
                </Text>
              ) : null}

              {/* Email */}
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errors.email) setErrors((e) => ({ ...e, email: "" }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isPending}
                className={`w-full bg-gray-50 rounded-2xl px-5 py-4 text-base text-gray-900 mt-3 ${errors.email ? "border border-red-400" : ""}`}
                placeholderTextColor="#9CA3AF"
              />
              {errors.email ? (
                <Text className="text-red-500 text-xs mt-1 ml-2">
                  {errors.email}
                </Text>
              ) : null}

              {/* Phone Number with Dial Code Picker */}
              <View
                className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 mt-3 ${errors.phone ? "border border-red-400" : ""}`}
              >
                <TouchableOpacity
                  onPress={() => setShowDialCodeModal(true)}
                  className="flex-row items-center mr-2"
                  disabled={isPending}
                >
                  <Text style={{ fontSize: 20 }}>
                    {selectedDialCountry.flag}
                  </Text>
                  <Text className="text-gray-700 text-sm ml-1">
                    {selectedDialCountry.dial}
                  </Text>
                  <Feather
                    name="chevron-down"
                    size={14}
                    color="#9CA3AF"
                    style={{ marginLeft: 2 }}
                  />
                </TouchableOpacity>
                <View className="w-px h-6 bg-gray-300 mr-3" />
                <TextInput
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChangeText={(t) => {
                    // Only allow digits
                    const cleaned = t.replace(/\D/g, "");
                    setPhoneNumber(cleaned);
                    if (errors.phone) setErrors((e) => ({ ...e, phone: "" }));
                  }}
                  keyboardType="phone-pad"
                  editable={!isPending}
                  className="flex-1 text-base text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  maxLength={15}
                />
              </View>
              {errors.phone ? (
                <Text className="text-red-500 text-xs mt-1 ml-2">
                  {errors.phone}
                </Text>
              ) : null}

              {/* Country Selector */}
              <TouchableOpacity
                onPress={() => setShowCountryModal(true)}
                disabled={isPending}
                className={`flex-row items-center bg-gray-50 rounded-2xl px-5 py-4 mt-3 ${errors.country ? "border border-red-400" : ""}`}
              >
                {selectedCountry ? (
                  <>
                    <Text style={{ fontSize: 20 }}>{selectedCountry.flag}</Text>
                    <Text className="flex-1 text-base text-gray-900 ml-3">
                      {selectedCountry.name}
                    </Text>
                  </>
                ) : (
                  <Text className="flex-1 text-base text-gray-400">
                    Select country
                  </Text>
                )}
                <Feather name="chevron-down" size={18} color="#9CA3AF" />
              </TouchableOpacity>
              {errors.country ? (
                <Text className="text-red-500 text-xs mt-1 ml-2">
                  {errors.country}
                </Text>
              ) : null}

              {/* Password */}
              <View
                className={`flex-row items-center bg-gray-50 rounded-2xl px-5 py-4 mt-3 ${errors.password ? "border border-red-400" : ""}`}
              >
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (errors.password)
                      setErrors((e) => ({ ...e, password: "" }));
                  }}
                  secureTextEntry={!showPassword}
                  editable={!isPending}
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
              {errors.password ? (
                <Text className="text-red-500 text-xs mt-1 ml-2">
                  {errors.password}
                </Text>
              ) : null}

              {/* Terms and Conditions */}
              <TouchableOpacity
                onPress={() => {
                  setAgreeToTerms(!agreeToTerms);
                  if (errors.terms) setErrors((e) => ({ ...e, terms: "" }));
                }}
                className="flex-row items-center mt-4"
                disabled={isPending}
                activeOpacity={0.7}
              >
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${agreeToTerms ? "bg-black border-black" : "border-gray-300"}`}
                >
                  {agreeToTerms && (
                    <Feather name="check" size={12} color="white" />
                  )}
                </View>
                <Text className="flex-1 text-gray-600 text-sm">
                  I agree to the{" "}
                  <Text className="text-orange-500">Terms of Service</Text> and{" "}
                  <Text className="text-orange-500">Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {errors.terms ? (
                <Text className="text-red-500 text-xs mt-1 ml-2">
                  {errors.terms}
                </Text>
              ) : null}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={isPending}
              className={`w-full rounded-2xl py-4 items-center justify-center mt-6 ${isPending ? "bg-gray-400" : "bg-black"}`}
              activeOpacity={0.8}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-[22px] font-light">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              onPress={handleCancel}
              className="w-full items-center justify-center mt-3"
              activeOpacity={0.8}
            >
              <Text className="text-gray-600 text-base font-medium">
                Cancel
              </Text>
            </TouchableOpacity>

            {/* Already have account */}
            <TouchableOpacity
              onPress={handleLogin}
              className="flex-row items-center justify-center mt-3 mb-4"
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

      {/* Country Selection Modal */}
      {renderPickerModal(
        showCountryModal,
        () => {
          setShowCountryModal(false);
          setCountrySearch("");
        },
        "Select Country",
        countrySearch,
        setCountrySearch,
        filteredCountries,
        (c) => {
          setSelectedCountry(c);
          setShowCountryModal(false);
          setCountrySearch("");
          if (errors.country) setErrors((e) => ({ ...e, country: "" }));
        },
        false
      )}

      {/* Dial Code Selection Modal */}
      {renderPickerModal(
        showDialCodeModal,
        () => {
          setShowDialCodeModal(false);
          setDialCodeSearch("");
        },
        "Select Country Code",
        dialCodeSearch,
        setDialCodeSearch,
        filteredDialCountries,
        (c) => {
          setSelectedDialCountry(c);
          setShowDialCodeModal(false);
          setDialCodeSearch("");
        },
        true
      )}
    </View>
  );
}
