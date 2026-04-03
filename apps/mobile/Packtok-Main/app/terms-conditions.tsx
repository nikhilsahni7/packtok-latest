import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TermsSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const sections: TermsSection[] = [
  {
    title: "Terms & Conditions",
    paragraphs: [
      "Welcome to Packtok.com. By accessing and using our platform, you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully before using our services.",
    ],
  },
  {
    title: "1. Acceptance of Terms",
    paragraphs: [
      "By registering, browsing, or using Packtok.com, you acknowledge that you have read, understood, and agreed to these Terms & Conditions. If you do not agree, you may not use our platform.",
    ],
  },
  {
    title: "2. Platform Usage",
    paragraphs: [
      "Packtok.com is an industrial marketplace that connects buyers and sellers of corrugated and packaging machinery, raw materials, and related services.",
    ],
    bullets: [
      "Users must be at least 18 years of age and authorized to enter into binding business contracts.",
      "You agree to use the platform only for lawful purposes and in compliance with applicable laws and regulations.",
    ],
  },
  {
    title: "3. Account Registration",
    bullets: [
      "Users must provide accurate company and contact details during registration.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "Any activity conducted under your account will be deemed your responsibility.",
    ],
  },
  {
    title: "4. Product Listings & Transactions",
    bullets: [
      "Sellers are responsible for providing accurate descriptions, specifications, and images of their machinery or raw materials.",
      "Packtok.com does not guarantee the accuracy, quality, or legality of listings provided by sellers.",
      "Buyers must verify product details and negotiate directly with sellers before making purchases.",
      "Packtok.com acts as a facilitator and is not responsible for the outcome of transactions between users.",
    ],
  },
  {
    title: "5. Payments & Pricing",
    bullets: [
      "All payments and pricing details are to be agreed upon between buyers and sellers.",
      "Packtok.com may provide payment gateway services, but it is not responsible for payment disputes, delays, or non-payment issues.",
    ],
  },
  {
    title: "6. Installation & Services",
    bullets: [
      "For machinery installation requests submitted through our platform, clients must provide complete details, including machine specifications, images/videos, site location, and requirements.",
      "Packtok.com only facilitates connections between customers and service providers; the responsibility for installation lies with the installer and the customer.",
    ],
  },
  {
    title: "7. Prohibited Activities",
    paragraphs: ["Users are strictly prohibited from:"],
    bullets: [
      "Posting false, misleading, or fraudulent listings.",
      "Uploading offensive, unlawful, or copyrighted content without permission.",
      "Misusing the platform for activities unrelated to corrugated and packaging trade.",
    ],
  },
  {
    title: "8. Token Amount & Cancellations",
    bullets: [
      "In cases where a token amount is paid to confirm a deal, the token amount shall be non-refundable if the customer cancels the deal.",
      "If the cancellation is initiated from the company side, the company shall be liable to refund double the token amount paid by the customer.",
    ],
  },
  {
    title: "9. Intellectual Property",
    paragraphs: [
      "All content, trademarks, designs, and materials on Packtok.com are the property of Packtok or its licensors. Users may not copy, distribute, or use any content without prior written permission.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    bullets: [
      "Packtok.com is a digital platform and does not own, manufacture, or inspect the listed machinery or raw materials.",
      "We are not liable for any loss, damage, or disputes arising from user transactions, product quality, or service delays.",
      "Users agree to transact at their own risk and responsibility.",
    ],
  },
  {
    title: "11. Privacy & Data Protection",
    bullets: [
      "We respect your privacy and safeguard your personal and business data.",
      "Information shared on the platform may be used to improve services, but will not be sold to third parties without consent.",
    ],
  },
  {
    title: "12. Modifications",
    paragraphs: [
      "Packtok.com reserves the right to update or modify these Terms & Conditions at any time. Continued use of the platform after updates constitutes acceptance of the revised terms.",
    ],
  },
  {
    title: "13. Governing Law",
    paragraphs: [
      "These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of courts in Delhi/NCR.",
    ],
  },
];

export default function TermsConditionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="px-5 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3"
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">
          Terms & Conditions
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-5 py-5 bg-gradient-to-br from-orange-50 to-white border-b border-gray-200">
          <Text className="text-sm text-gray-700 leading-5">
            Please read these terms and conditions carefully before using our
            services.
          </Text>
        </View>

        <View className="px-5 py-5">
          {sections.map((section) => (
            <View key={section.title} className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-2">
                {section.title}
              </Text>

              {section.paragraphs?.map((paragraph, index) => (
                <Text
                  key={`${section.title}-p-${index}`}
                  className="text-sm text-gray-700 leading-6 mb-2"
                >
                  {paragraph}
                </Text>
              ))}

              {section.bullets?.map((bullet, index) => (
                <View
                  key={`${section.title}-b-${index}`}
                  className="flex-row items-start mb-1.5"
                >
                  <Text className="text-sm text-gray-700 mr-2">•</Text>
                  <Text className="text-sm text-gray-700 leading-6 flex-1">
                    {bullet}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          <View className="pt-5 mt-2 border-t border-gray-200">
            <Text className="text-xs text-gray-500">
              Last updated: January 2025
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
