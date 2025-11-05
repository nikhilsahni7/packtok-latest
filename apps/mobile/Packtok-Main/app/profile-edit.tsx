import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCurrentUser, useUpdateUser } from "../hooks/useCurrentUser";

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
      // Set existing profile image if available
      if (user.profile_image) {
        setProfileImage(user.profile_image);
      }
    }
  }, [user, setValue]);

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

      // Prepare file for upload
      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      setImageFile({
        uri,
        type,
        name: filename,
      });
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    const updateData: any = {
      name: data.name,
      phone_number: data.phone_number,
      country: data.country,
    };

    // Add profile image if user selected a new one
    if (imageFile) {
      updateData.profile_image = imageFile;
    }

    updateUser(updateData);
  };

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

              {/* Phone Number */}
              <Controller
                control={control}
                name="phone_number"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    className="bg-gray-50 rounded-xl px-4 py-4 text-base text-gray-900 mb-3"
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />

              {/* Country */}
              <Controller
                control={control}
                name="country"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Country"
                    className="bg-gray-50 rounded-xl px-4 py-4 text-base text-gray-900"
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="px-5 pb-6 pt-4 border-t border-gray-100">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isPending || (!isDirty && !hasImageChanged)}
            className={`rounded-xl py-4 shadow-md ${
              isPending || (!isDirty && !hasImageChanged)
                ? "bg-gray-400"
                : "bg-black"
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
    </SafeAreaView>
  );
}
