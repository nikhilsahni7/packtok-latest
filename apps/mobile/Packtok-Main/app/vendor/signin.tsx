import VendorButton from "@/components/VendorButton";
import { useVendorLogin } from "@/hooks/useVendorAuth";
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

const blueBg = require("@/assets/images/bubble 05.png");
const { width, height } = Dimensions.get("window");

export default function VendorSigninScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: vendorLogin, isPending } = useVendorLogin();

  const handleSignin = () => {
    vendorLogin({ email, password });
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password" as any);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" translucent backgroundColor="transparent" />

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
        source={blueBg}
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
      >
        <View className="flex-1 px-8 pt-12">
          <View className="items-center">
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: width * 1.8, height: undefined, aspectRatio: 3 }}
              resizeMode="contain"
            />
          </View>

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

          <Text className="text-3xl font-bold text-gray-900 my-6">
            Sign In as Vendor
          </Text>

          <View className="space-y-4">
            <TextInput
              placeholder="Vendor email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isPending}
              className="w-full bg-gray-50 rounded-full px-5 py-5 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
            />

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

          <VendorButton
            onPress={handleSignin}
            disabled={isPending}
            loading={isPending}
            label="Sign In"
            size="lg"
            className="w-full mt-8"
            textClassName="text-[18px]"
          />

          <TouchableOpacity
            onPress={() => router.push("/signup-vendor" as any)}
            className="self-center mt-5"
            activeOpacity={0.7}
          >
            <Text className="text-sm text-gray-600">
              New vendor?{" "}
              <Text className="text-orange-500 font-semibold">
                Sign Up as Vendor
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="w-full items-center justify-center mt-6 mb-8"
            activeOpacity={0.8}
          >
            <Text className="text-gray-600 text-base font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
