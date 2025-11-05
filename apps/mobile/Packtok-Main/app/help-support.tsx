import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpSupportScreen() {
  const router = useRouter();

  const handleEmailPress = async (email: string) => {
    const url = `mailto:${email}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const handlePhonePress = async (phone: string) => {
    const url = `tel:${phone.replace(/\s/g, "")}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "You can create an account by clicking on the 'Sign Up' button on the welcome screen. Fill in your details and verify your email to get started.",
    },
    {
      question: "How do I place an order?",
      answer:
        "Browse our marketplace, add items to your cart, and proceed to checkout. You can request quotes for bulk orders or custom machinery.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including bank transfers, letters of credit, and secure online payments for factory-related transactions.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is confirmed, you'll receive tracking information via email. You can also check order status in the 'My Orders' section.",
    },
    {
      question: "What is your return policy?",
      answer:
        "Returns depend on the product type and supplier. Contact our support team within 7 days of delivery for assistance with returns or exchanges.",
    },
    {
      question: "How do I become a vendor?",
      answer:
        "Click on 'Vendor Sign Up' and complete the vendor registration form. Our team will review your application and contact you within 3-5 business days.",
    },
  ];

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
        <Text className="text-xl font-bold text-gray-900">Help & Support</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="px-5 py-6 bg-gradient-to-br from-orange-50 to-white">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Let&apos;s Power Your Production
          </Text>
          <Text className="text-sm text-gray-600 leading-5">
            Packtok committed to delivering high-performance corrugated and
            packaging machine solution, whether you need advanced machinery,
            quality raw materials, or reliable spare parts. Our team is here to
            assist with product inquiries, custom quotes, technical support, and
            order tracking—anytime you need it.
          </Text>
        </View>

        {/* About Us Section */}
        <View className="px-5 py-6 border-t border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-3">About Us</Text>
          <Text className="text-sm text-gray-700 leading-6">
            We specialize in corrugated and packaging machinery, raw materials,
            and spare parts—providing high-quality, reliable solutions for
            manufacturers and businesses. Since 35 years, we&apos;ve been
            committed to delivering performance, precision, and dependable
            support to keep your operations running at their best.
          </Text>
        </View>

        {/* Contact Offices */}
        <View className="px-5 py-6 border-t border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Our Offices
          </Text>

          {/* Dubai Office */}
          <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-sm">
            <View className="flex-row items-start mb-3">
              <View className="w-10 h-10 rounded-full bg-[#FF8C42]/10 items-center justify-center mr-3">
                <Feather name="map-pin" size={20} color="#FF8C42" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900 mb-2">
                  Dubai Office
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  PACKTOK F.Z.E, FREE ZONE AJMAN, UNITED ARAB EMIRATES{"\n"}
                  ADDRESS - PER NO. 169423{"\n"}P.O. BOX: 932
                </Text>
              </View>
            </View>
          </View>

          {/* India Office */}
          <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-sm">
            <View className="flex-row items-start mb-3">
              <View className="w-10 h-10 rounded-full bg-[#FF8C42]/10 items-center justify-center mr-3">
                <Feather name="map-pin" size={20} color="#FF8C42" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900 mb-2">
                  India Office
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Packtok Machinery Pvt Ltd{"\n"}Plot No. 43, Sector 59 HSIIDC,
                  {"\n"}FARIDABAD Ballabaghar, Haryana. 121004
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Cards */}
        <View className="px-5 py-6 border-t border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Contact Us
          </Text>

          {/* Phone - Dubai */}
          <TouchableOpacity
            onPress={() => handlePhonePress("+971 508 973 241")}
            className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full bg-[#FF8C42]/10 items-center justify-center mr-4">
              <Feather name="phone" size={24} color="#FF8C42" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-500 mb-1">Dubai</Text>
              <Text className="text-base font-semibold text-gray-900">
                +971 508 973 241
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Phone - India */}
          <TouchableOpacity
            onPress={() => handlePhonePress("+91 987 364 0291")}
            className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full bg-[#FF8C42]/10 items-center justify-center mr-4">
              <Feather name="phone" size={24} color="#FF8C42" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-500 mb-1">India</Text>
              <Text className="text-base font-semibold text-gray-900">
                +91 987 364 0291
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Phone - Support */}
          <TouchableOpacity
            onPress={() => handlePhonePress("+91 81045-43204")}
            className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full bg-[#FF8C42]/10 items-center justify-center mr-4">
              <Feather name="phone" size={24} color="#FF8C42" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-500 mb-1">
                We&apos;re just a call away
              </Text>
              <Text className="text-base font-semibold text-gray-900">
                +91 81045-43204
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            onPress={() => handleEmailPress("Packtok01@gmail.com")}
            className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full bg-[#FF8C42]/10 items-center justify-center mr-4">
              <Feather name="mail" size={24} color="#FF8C42" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-500 mb-1">Email</Text>
              <Text className="text-base font-semibold text-gray-900">
                Packtok01@gmail.com
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View className="px-5 py-6 border-t border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </Text>

          <View className="space-y-3">
            {faqs.map((faq, index) => (
              <View
                key={index}
                className="bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-100"
              >
                <View className="flex-row items-start">
                  <Feather
                    name="help-circle"
                    size={20}
                    color="#FF8C42"
                    style={{ marginTop: 2, marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </Text>
                    <Text className="text-sm text-gray-600 leading-5">
                      {faq.answer}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Support Hours */}
        <View className="px-5 py-6 border-t border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Support Hours
          </Text>
          <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <View className="flex-row items-center mb-2">
              <Feather name="clock" size={20} color="#3B82F6" />
              <Text className="text-base font-semibold text-gray-900 ml-2">
                We&apos;re here to help!
              </Text>
            </View>
            <Text className="text-sm text-gray-700 leading-5">
              Monday - Friday: 9:00 AM - 6:00 PM{"\n"}
              Saturday: 10:00 AM - 4:00 PM{"\n"}
              Sunday: Closed
            </Text>
          </View>
        </View>

        {/* Footer Padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
