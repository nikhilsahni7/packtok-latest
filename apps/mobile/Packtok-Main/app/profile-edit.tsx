import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
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
import { useCurrentUser, useUpdateUser } from "../hooks/useCurrentUser";

// Country data (same as signup-user.tsx)
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

// Parse existing phone number to extract dial code and local number
function parsePhoneNumber(phone: string): {
  dialCountry: (typeof COUNTRIES)[0];
  localNumber: string;
} {
  const defaultCountry = COUNTRIES.find((c) => c.code === "IN")!;
  if (!phone) return { dialCountry: defaultCountry, localNumber: "" };

  // Try to match longest dial code first
  const sortedByDialLength = [...COUNTRIES].sort(
    (a, b) => b.dial.length - a.dial.length
  );
  for (const country of sortedByDialLength) {
    if (phone.startsWith(country.dial)) {
      return {
        dialCountry: country,
        localNumber: phone.slice(country.dial.length),
      };
    }
  }

  // Fallback: strip leading + and return as local number
  return {
    dialCountry: defaultCountry,
    localNumber: phone.replace(/^\+/, ""),
  };
}

interface ProfileFormData {
  name: string;
  email: string;
  phone_number: string;
  country: string;
}

export default function ProfileEditScreen() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: updateUser, isPending } = useUpdateUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  // Country & dial code picker state
  const [selectedCountry, setSelectedCountry] = useState<
    (typeof COUNTRIES)[0] | null
  >(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const [selectedDialCountry, setSelectedDialCountry] = useState(
    COUNTRIES.find((c) => c.code === "IN")!
  );
  const [showDialCodeModal, setShowDialCodeModal] = useState(false);
  const [dialCodeSearch, setDialCodeSearch] = useState("");

  const [localPhoneNumber, setLocalPhoneNumber] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      country: "",
    },
  });

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("phone_number", user.phone_number || "");
      setValue("country", user.country || "");

      // Set profile image
      if (user.profile_image) {
        setProfileImage(user.profile_image);
      }

      // Parse country code
      const foundCountry = COUNTRIES.find(
        (c) => c.code === (user.country || "").toUpperCase()
      );
      if (foundCountry) {
        setSelectedCountry(foundCountry);
      }

      // Parse phone number to extract dial code and local number
      if (user.phone_number) {
        const parsed = parsePhoneNumber(user.phone_number);
        setSelectedDialCountry(parsed.dialCountry);
        setLocalPhoneNumber(parsed.localNumber);
      }
    }
  }, [user, setValue]);

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to change your profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      setHasImageChanged(true);

      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      setImageFile({ uri, type, name: filename });
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    const updateData: any = {
      name: data.name,
      country: selectedCountry?.code || data.country,
    };

    // Build phone number in E.164 format
    if (localPhoneNumber.trim()) {
      updateData.phone_number = `${selectedDialCountry.dial}${localPhoneNumber.replace(/\D/g, "")}`;
    } else {
      updateData.phone_number = "";
    }

    if (imageFile) {
      updateData.profile_image = imageFile;
    }

    updateUser(updateData);
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
        <Text className="flex-1 ml-3 text-base text-gray-900">
          {item.name}
        </Text>
        {showDial && (
          <Text className="text-gray-500 text-sm">{item.dial}</Text>
        )}
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
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-3 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">{title}</Text>
          <TouchableOpacity onPress={onClose}>
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
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View className="px-5 py-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center"
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Profile</Text>
            <View className="w-10" />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Section */}
          <View className="px-5 py-8">
            <Text className="text-base text-gray-600 mb-6">Your Profile</Text>

            {/* Profile Picture */}
            <View className="items-center mb-8">
              <View className="relative">
                {profileImage || user?.name ? (
                  <View className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <Image
                        source={{ uri: profileImage }}
                        className="w-full h-full"
                      />
                    ) : (
                      <Text className="text-white text-3xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View className="w-24 h-24 rounded-full bg-gray-300" />
                )}

                {/* Edit Button */}
                <TouchableOpacity
                  onPress={pickImage}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full items-center justify-center border-2 border-white"
                  activeOpacity={0.8}
                >
                  <Feather name="edit-2" size={14} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Fields */}
            <View className="space-y-4">
              {/* Name */}
              <Controller
                control={control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Full Name"
                      className="bg-gray-50 rounded-xl px-4 py-4 text-base text-gray-900 mb-3"
                      placeholderTextColor="#9ca3af"
                    />
                    {errors.name && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Email (Read-only) */}
              <Controller
                control={control}
                name="email"
                render={({ field: { value } }) => (
                  <TextInput
                    value={value}
                    placeholder="Email"
                    editable={false}
                    className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-500 mb-3"
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />

              {/* Phone Number with Dial Code Picker */}
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 mb-3">
                <TouchableOpacity
                  onPress={() => setShowDialCodeModal(true)}
                  className="flex-row items-center mr-2"
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
                  value={localPhoneNumber}
                  onChangeText={(t) =>
                    setLocalPhoneNumber(t.replace(/\D/g, ""))
                  }
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  className="flex-1 text-base text-gray-900"
                  placeholderTextColor="#9ca3af"
                  maxLength={15}
                />
              </View>

              {/* Country Selector */}
              <TouchableOpacity
                onPress={() => setShowCountryModal(true)}
                className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4"
                activeOpacity={0.7}
              >
                {selectedCountry ? (
                  <>
                    <Text style={{ fontSize: 20 }}>
                      {selectedCountry.flag}
                    </Text>
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
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="px-5 pb-6 pt-4 border-t border-gray-100">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isPending || (!isDirty && !hasImageChanged && !localPhoneNumber)}
            className={`rounded-xl py-4 shadow-md ${
              isPending ? "bg-gray-400" : "bg-black"
            }`}
            activeOpacity={0.8}
          >
            {isPending ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white font-semibold text-base ml-2">
                  Saving...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-base text-center">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
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
          setValue("country", c.code, { shouldDirty: true });
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
    </SafeAreaView>
  );
}
