import api, { TokenStorage } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FacilityProperty = {
  id: string;
  name: string;
  location: string;
  image: string;
};

export default function AcquisitionFacilitiesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedProperty, setSelectedProperty] =
    useState<FacilityProperty | null>(null);
  const [message, setMessage] = useState("");

  const {
    data: properties = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<FacilityProperty[]>({
    queryKey: ["investment-properties"],
    queryFn: async () => {
      const response = await api.get("/api/v1/investments");
      return response.data?.data ?? [];
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const submitQueryMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProperty) return;

      await api.post("/api/v1/investments/query", {
        propertyId: selectedProperty.id,
        message,
      });
    },
    onSuccess: () => {
      Alert.alert("Success", "Query submitted successfully!");
      setSelectedProperty(null);
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["investment-properties"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to submit query.";
      Alert.alert("Error", errorMessage);
    },
  });

  const handleOpenQuery = async (property: FacilityProperty) => {
    const token = await TokenStorage.getAccessToken();

    if (!token) {
      Alert.alert(
        "Login Required",
        "Please login to send a query for this property.",
        [
          {
            text: "Go to Login",
            onPress: () => router.push("/login" as any),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
      );
      return;
    }

    setSelectedProperty(property);
  };

  const handleSubmitQuery = () => {
    submitQueryMutation.mutate();
  };

  const featuredProperty = properties[0] ?? null;
  const remainingProperties = properties.slice(1);

  const renderPropertyCard = ({ item }: { item: FacilityProperty }) => (
    <View className="bg-white rounded-2xl border border-gray-200 mb-4 overflow-hidden">
      <Image
        source={{ uri: item.image }}
        className="w-full h-44"
        resizeMode="cover"
      />

      <View className="p-4">
        <Text className="text-base font-bold text-gray-900" numberOfLines={2}>
          {item.name}
        </Text>

        <View className="flex-row items-center mt-1">
          <Feather name="map-pin" size={14} color="#6B7280" />
          <Text className="text-sm text-gray-500 ml-1 flex-1" numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => handleOpenQuery(item)}
          className="mt-4 bg-black rounded-full py-3 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">Send Query</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      <View className="pt-12 pb-6 px-5 bg-[#111827]">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-white/15 rounded-full mr-3"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white flex-1">
            Premium Industrial Facilities
          </Text>
        </View>

        <Text className="text-sm text-gray-200 leading-5">
          Discover high-value manufacturing plants and warehouses with turnkey
          operations for immediate acquisition.
        </Text>

        <View className="mt-4 self-start bg-white/15 rounded-full px-3 py-1">
          <Text className="text-xs text-white font-medium">
            {properties.length} active{" "}
            {properties.length === 1 ? "property" : "properties"}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 py-10 items-center justify-center">
          <ActivityIndicator size="large" color="#111827" />
          <Text className="mt-3 text-gray-600">Loading properties...</Text>
        </View>
      ) : properties.length === 0 ? (
        <View className="flex-1 py-12 px-6 items-center justify-center">
          <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
            <Feather name="home" size={28} color="#6B7280" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 text-center">
            No facilities available
          </Text>
          <Text className="text-sm text-gray-600 text-center mt-2 leading-5">
            New premium industrial properties will appear here as soon as they
            are published.
          </Text>
        </View>
      ) : (
        <FlatList
          data={remainingProperties}
          keyExtractor={(item) => item.id}
          renderItem={renderPropertyCard}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isRefetching}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            paddingBottom: 24,
          }}
          ListHeaderComponent={
            <>
              {featuredProperty && (
                <View className="rounded-3xl overflow-hidden border border-gray-200 bg-white mb-6">
                  <Image
                    source={{ uri: featuredProperty.image }}
                    className="w-full h-56"
                    resizeMode="cover"
                  />

                  <View className="p-5">
                    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Featured Facility
                    </Text>
                    <Text
                      className="text-xl font-bold text-gray-900"
                      numberOfLines={2}
                    >
                      {featuredProperty.name}
                    </Text>

                    <View className="flex-row items-center mt-2">
                      <Feather name="map-pin" size={14} color="#6B7280" />
                      <Text
                        className="text-sm text-gray-500 ml-1"
                        numberOfLines={1}
                      >
                        {featuredProperty.location}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleOpenQuery(featuredProperty)}
                      className="mt-4 bg-black rounded-full py-3 items-center"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white font-semibold">
                        Send Query
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {remainingProperties.length > 0 && (
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">
                    More Facilities
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {remainingProperties.length} listed
                  </Text>
                </View>
              )}
            </>
          }
        />
      )}

      <Modal
        visible={!!selectedProperty}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setSelectedProperty(null);
          setMessage("");
        }}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-5 pb-7">
            <View className="self-center w-12 h-1.5 rounded-full bg-gray-300 mb-4" />
            <Text className="text-lg font-bold text-gray-900 mb-1">
              Send Query
            </Text>

            <Text className="text-sm text-gray-600 mb-4">
              Interested in {selectedProperty?.name} at{" "}
              {selectedProperty?.location}?
            </Text>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Enter your message or questions (optional)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
            />

            <View className="flex-row justify-end mt-4 gap-3">
              <TouchableOpacity
                onPress={() => {
                  setSelectedProperty(null);
                  setMessage("");
                }}
                className="px-5 py-3 rounded-full border border-gray-300"
                activeOpacity={0.8}
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmitQuery}
                disabled={submitQueryMutation.isPending}
                className={`px-5 py-3 rounded-full ${
                  submitQueryMutation.isPending ? "bg-gray-400" : "bg-black"
                }`}
                activeOpacity={0.8}
              >
                <Text className="text-white font-medium">
                  {submitQueryMutation.isPending
                    ? "Submitting..."
                    : "Submit Query"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
