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
    title: "Shipping & Delivery Policy",
    paragraphs: [
      "At Packtok.com, we aim to provide a smooth and reliable experience for the purchase and delivery of corrugated and packaging machinery as well as raw materials. Since our platform connects buyers and sellers, all shipping and delivery processes are managed directly by the respective sellers or logistics partners.",
    ],
  },
  {
    title: "1. Shipping Responsibility",
    bullets: [
      "Sellers are responsible for arranging shipping and delivery of machinery, spare parts, or raw materials listed on Packtok.com.",
      "Buyers must confirm shipping charges, delivery timelines, and transportation mode with the seller before completing the purchase.",
      "Packtok.com does not handle shipping directly but facilitates communication between buyers, sellers, and logistics partners.",
    ],
  },
  {
    title: "2. Delivery Timelines",
    bullets: [
      "Delivery timelines vary depending on product type (machinery or raw materials), order size, and shipping location.",
      "Sellers are expected to provide buyers with an estimated delivery schedule before dispatch.",
      "Any delays due to transportation, customs clearance, or unforeseen circumstances are beyond Packtok's control.",
    ],
  },
  {
    title: "3. Packaging & Handling",
    bullets: [
      "Sellers must ensure proper packaging of machinery and raw materials to prevent damage during transit.",
      "Heavy and large machines should be secured with industrial-grade packing and handling measures.",
      "Buyers are advised to inspect packaging upon delivery and report any visible damage immediately.",
    ],
  },
  {
    title: "4. Shipping Costs",
    bullets: [
      "Shipping charges are borne by the buyer unless otherwise agreed with the seller.",
      "Costs depend on product dimensions, weight, distance, and mode of transport (road, sea, or air).",
      "Sellers must clearly communicate all applicable charges before finalizing the order.",
    ],
  },
  {
    title: "5. Risk & Insurance",
    bullets: [
      "Risk of damage or loss during transit lies with the seller until delivery is completed.",
      "For high-value machinery, sellers and buyers are encouraged to arrange transit insurance.",
      "Packtok.com is not responsible for transit damages, delays, or losses.",
    ],
  },
  {
    title: "6. International Shipping",
    bullets: [
      "For exports and imports of corrugated machinery and raw materials, buyers and sellers must comply with applicable customs laws, duties, and documentation.",
      "Packtok.com does not handle customs clearance but provides a platform to facilitate global trade.",
    ],
  },
  {
    title: "7. Delivery Confirmation",
    bullets: [
      "Buyers should verify product details, quantity, and condition at the time of delivery.",
      "Once delivery is accepted, future claims regarding damage or shortages may not be considered valid.",
    ],
  },
  {
    title: "8. Contact Us",
    paragraphs: [
      "For queries regarding shipping and delivery, please contact us at support@packtok.com.",
    ],
  },
];

export default function ShippingDeliveryScreen() {
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
          Shipping & Delivery
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-5 py-5 border-b border-gray-200 bg-orange-50">
          <Text className="text-sm text-gray-700 leading-5">
            Learn how shipping and delivery work on Packtok.
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
