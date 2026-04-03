import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PolicySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const sections: PolicySection[] = [
  {
    title: "Privacy Policy",
    paragraphs: [
      "At Packtok.com, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal and business information when you use our platform.",
    ],
  },
  {
    title: "1. Information We Collect",
    paragraphs: [
      "When you use Packtok.com, we may collect the following information:",
    ],
    bullets: [
      "Company Details: Name, address, registration details.",
      "Contact Information: Name, email, phone number.",
      "Business Activity: Product listings, purchase/sale preferences, service requests.",
      "Media Files: Images, videos, and documents uploaded by users.",
      "Usage Data: Log files, browser type, IP address, and platform activity.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    paragraphs: ["The information we collect is used to:"],
    bullets: [
      "Facilitate buying, selling, and installation services for corrugated and packaging machinery and raw materials.",
      "Provide a secure and smooth user experience.",
      "Communicate updates, offers, and important platform information.",
      "Improve platform features, usability, and customer support.",
      "Ensure compliance with legal and regulatory requirements.",
    ],
  },
  {
    title: "3. Sharing of Information",
    bullets: [
      "Packtok.com does not sell or rent your personal or business information to third parties.",
      "Information may be shared with trusted service providers or partners who assist in payment processing, logistics, or installation services.",
      "We may disclose information if required by law, regulation, or legal process.",
    ],
  },
  {
    title: "4. Data Security",
    bullets: [
      "We use industry-standard measures to safeguard your data against unauthorized access, misuse, or disclosure.",
      "While we strive to protect your data, no online platform can guarantee 100% security. Users share information at their own risk.",
    ],
  },
  {
    title: "5. Cookies & Tracking",
    bullets: [
      "Our platform may use cookies to enhance user experience, store preferences, and analyze site performance.",
      "Users can choose to disable cookies in their browser settings, though some features may not function properly.",
    ],
  },
  {
    title: "6. User Responsibilities",
    bullets: [
      "Users are responsible for maintaining the confidentiality of their account details.",
      "Please ensure the information you provide is accurate, updated, and lawful.",
    ],
  },
  {
    title: "7. Third-Party Links",
    paragraphs: [
      "Packtok.com may contain links to third-party websites. We are not responsible for the privacy practices or content of such external sites.",
    ],
  },
  {
    title: "8. Children's Privacy",
    paragraphs: [
      "Our services are designed for businesses and professionals. We do not knowingly collect information from individuals under 18 years of age.",
    ],
  },
  {
    title: "9. Policy Updates",
    paragraphs: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page, and continued use of the platform constitutes acceptance of those changes.",
    ],
  },
  {
    title: "10. Contact Us",
    paragraphs: [
      "If you have any questions or concerns regarding this Privacy Policy, please contact us at support@packtok.com.",
    ],
  },
];

export default function PrivacyPolicyScreen() {
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
        <Text className="text-xl font-bold text-gray-900">Privacy Policy</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-5 py-5 border-b border-gray-200 bg-orange-50">
          <Text className="text-sm text-gray-700 leading-5">
            Learn how we collect, use, and protect your information.
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
