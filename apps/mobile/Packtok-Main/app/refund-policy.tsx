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
    title: "Refund & Cancellation Policy",
    paragraphs: [
      "At Packtok.com, we strive to provide a transparent and reliable platform for buying, selling, and installing corrugated and packaging machinery and raw materials. This Refund & Cancellation Policy outlines how refunds and cancellations are handled on our platform.",
    ],
  },
  {
    title: "1. Nature of Our Platform",
    bullets: [
      "Packtok.com is a B2B marketplace that connects buyers and sellers.",
      "We do not manufacture or own the listed products; we only facilitate transactions between users.",
      "Therefore, all refunds, returns, and cancellations are subject to the terms agreed between the buyer and the seller.",
    ],
  },
  {
    title: "2. Refund Eligibility",
    paragraphs: [
      "A refund may be applicable under the following circumstances:",
    ],
    bullets: [
      "If a buyer makes a payment through our platform but the seller fails to deliver the product or service.",
      "If the product delivered is significantly different from the description provided by the seller.",
      "If the transaction is canceled before shipment or service execution, as per mutual agreement between buyer and seller.",
    ],
  },
  {
    title: "3. Non-Refundable Cases",
    bullets: [
      "Packtok.com is not responsible for product quality, defects, or warranty-related issues. These must be resolved directly between buyer and seller.",
      "Service charges, platform fees, or payment gateway charges (if applicable) are non-refundable.",
      "Refunds will not be provided for disputes arising from buyer's change of mind after purchase.",
    ],
  },
  {
    title: "4. Refund Process",
    bullets: [
      "Buyers must raise a refund request within 7 working days of the transaction or delivery issue.",
      "All refund requests must include transaction details, proof of payment, and supporting documents (images/videos if applicable).",
      "Once verified, the refund will be processed as per the seller's refund policy and through the original mode of payment where possible.",
    ],
  },
  {
    title: "5. Packtok's Role in Disputes",
    bullets: [
      "Packtok.com may assist in mediating disputes between buyers and sellers but holds no liability for refund amounts, delays, or product issues.",
      "Final responsibility lies with the respective buyer and seller involved in the transaction.",
    ],
  },
  {
    title: "6. Contact Us",
    paragraphs: [
      "For refund or cancellation-related queries, please contact us at support@packtok.com.",
    ],
  },
];

export default function RefundPolicyScreen() {
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
        <Text className="text-xl font-bold text-gray-900">Refund Policy</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-5 py-5 border-b border-gray-200 bg-orange-50">
          <Text className="text-sm text-gray-700 leading-5">
            Understand our refund and cancellation process.
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
