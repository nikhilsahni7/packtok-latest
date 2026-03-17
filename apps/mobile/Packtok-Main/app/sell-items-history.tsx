import { useMyProductSubmissions } from "@/hooks/useProducts";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "pending" | "approved" | "rejected";

export default function SellItemsHistoryScreen() {
  const router = useRouter();
  const { data = [], isLoading, refetch } = useMyProductSubmissions();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("pending");

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (activeTab === "pending")
        return item.submissionStatus === "PENDING_APPROVAL";
      if (activeTab === "approved") return item.submissionStatus === "APPROVED";
      return item.submissionStatus === "REJECTED";
    });
  }, [activeTab, data]);

  const getSubmissionBadge = (status: string) => {
    if (status === "APPROVED")
      return { bg: "bg-green-100", text: "text-green-800", label: "APPROVED" };
    if (status === "REJECTED")
      return { bg: "bg-red-100", text: "text-red-800", label: "REJECTED" };
    return { bg: "bg-yellow-100", text: "text-yellow-800", label: "PENDING" };
  };

  const getProductRoute = (productId: string, productType?: string) => {
    if (productType === "MACHINERY")
      return `/marketplace/machinery/${productId}`;
    if (productType === "SPARE_PARTS")
      return `/marketplace/spare-parts/${productId}`;
    if (productType === "CONSUMABLES")
      return `/marketplace/consumables/${productId}`;
    if (productType === "RAW_MATERIALS")
      return `/marketplace/raw-material/${productId}`;
    return "/marketplace";
  };

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
          Sell Old Items Status
        </Text>
      </View>

      <View className="px-5 py-4 flex-row gap-2">
        <TouchableOpacity
          onPress={() => setActiveTab("pending")}
          className={`flex-1 py-3 rounded-xl ${activeTab === "pending" ? "bg-[#FF8C42]" : "bg-gray-100"}`}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "pending" ? "text-white" : "text-gray-600"}`}
          >
            PENDING
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("approved")}
          className={`flex-1 py-3 rounded-xl ${activeTab === "approved" ? "bg-[#FF8C42]" : "bg-gray-100"}`}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "approved" ? "text-white" : "text-gray-600"}`}
          >
            APPROVED
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("rejected")}
          className={`flex-1 py-3 rounded-xl ${activeTab === "rejected" ? "bg-[#FF8C42]" : "bg-gray-100"}`}
        >
          <Text
            className={`text-center font-semibold ${activeTab === "rejected" ? "text-white" : "text-gray-600"}`}
          >
            REJECTED
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View className="items-center justify-center py-14">
            <ActivityIndicator size="large" color="#FF8C42" />
          </View>
        ) : filtered.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Feather name="inbox" size={56} color="#D1D5DB" />
            <Text className="text-gray-500 mt-4">
              No submissions in this tab
            </Text>
          </View>
        ) : (
          <View className="pb-6">
            {filtered.map((item) => {
              const badge = getSubmissionBadge(item.submissionStatus);
              return (
                <View
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 shadow-sm"
                >
                  <View className="flex-row items-start mb-3">
                    {item.imagesThumbnail ? (
                      <Image
                        source={{ uri: item.imagesThumbnail }}
                        className="w-16 h-16 rounded-lg mr-3"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-16 h-16 rounded-lg bg-gray-100 items-center justify-center mr-3">
                        <Feather name="package" size={22} color="#9CA3AF" />
                      </View>
                    )}

                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text
                          className="text-base font-semibold text-gray-900 flex-1 mr-2"
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <View className={`${badge.bg} px-3 py-1 rounded-full`}>
                          <Text
                            className={`text-xs font-semibold ${badge.text}`}
                          >
                            {badge.label}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-xs text-gray-500 mb-1">
                        Type: {item.productType.replaceAll("_", " ")}
                      </Text>
                      <Text className="text-xs text-gray-500 mb-1">
                        Created: {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                      {item.reviewedAt && (
                        <Text className="text-xs text-gray-500">
                          Reviewed:{" "}
                          {new Date(item.reviewedAt).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  </View>

                  {item.reviewNotes ? (
                    <View className="bg-gray-50 rounded-lg p-3 mb-3">
                      <Text className="text-xs text-gray-500 mb-1">
                        Admin Notes:
                      </Text>
                      <Text className="text-sm text-gray-700">
                        {item.reviewNotes}
                      </Text>
                    </View>
                  ) : null}

                  <TouchableOpacity
                    onPress={() =>
                      router.push(
                        getProductRoute(item.id, item.productType) as any
                      )
                    }
                    className="py-2.5 rounded-lg border border-[#FF8C42]"
                    activeOpacity={0.7}
                  >
                    <Text className="text-center text-[#FF8C42] font-semibold">
                      View Product
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
