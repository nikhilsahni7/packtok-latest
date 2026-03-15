import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q: string }>();
  const [searchInput, setSearchInput] = useState(q || "");
  const [debouncedSearch, setDebouncedSearch] = useState(q || "");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch products
  const { data, isLoading, isError, refetch, isRefetching } = useProducts({
    searchTerm: debouncedSearch,
    limit: 20,
  });

  const products = data?.products || [];

  const handleProductPress = (productId: string, productType: string) => {
    // Navigate based on product type
    // This logic mimics the standard marketplace navigation
    let route = "";
    const type = productType?.toUpperCase() || "";
    
    if (type === "MACHINERY") route = "machinery";
    else if (type === "SPARE_PARTS") route = "spare-parts";
    else if (type === "CONSUMABLES") route = "consumables";
    else if (type === "RAW_MATERIALS") route = "raw-material";
    else route = "machinery"; // Default fallback
    router.push(`/marketplace/${route}/${productId}` as any);
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="flex-1 bg-white rounded-2xl m-2 overflow-hidden shadow-sm border border-gray-100"
      activeOpacity={0.7}
      onPress={() => handleProductPress(item.id, item.productType)}
    >
      <View className="relative">
        <Image
          source={{ uri: item.imagesThumbnail || item.images?.[0] || 'https://via.placeholder.com/150' }}
          className="w-full h-40"
          resizeMode="cover"
        />
        {item.status !== "AVAILABLE" && (
          <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">Sold Out</Text>
          </View>
        )}
      </View>
      <View className="p-3">
        <Text
          className="text-sm font-semibold text-gray-900 mb-1"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="text-xs text-gray-500 mb-2 truncate">
          {item.category?.name || item.productType}
        </Text>
        
        {item.displayPrice !== false && item.price ? (
          <Text className="text-base font-bold text-[#FF8C42]">
            {item.currency || "USD"} {item.price.toLocaleString()}
          </Text>
        ) : (
          <Text className="text-sm font-semibold text-[#FF8C42]">
            Price on Request
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header and Search Box */}
      <View className="bg-white px-5 py-4 border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center -ml-2"
          >
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 ml-2">Search</Text>
        </View>

        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-gray-900"
            value={searchInput}
            onChangeText={setSearchInput}
            autoFocus={!q}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={() => setSearchInput("")}>
              <Feather name="x-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {isLoading && !isRefetching ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FF8C42" />
            <Text className="mt-4 text-gray-500">Searching products...</Text>
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-6">
            <Feather name="alert-circle" size={48} color="#EF4444" />
            <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">
              Something went wrong
            </Text>
            <Text className="text-center text-gray-500 mb-6">
              We couldn't load the search results. Please try again.
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="bg-[#FF8C42] px-6 py-3 rounded-full"
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : products.length === 0 ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Feather name="search" size={64} color="#E5E7EB" />
            <Text className="text-xl font-bold text-gray-900 mt-6 mb-2 text-center">
              No results found
            </Text>
            <Text className="text-base text-gray-500 text-center leading-6">
              {debouncedSearch 
                ? `We couldn't find anything matching "${debouncedSearch}". Try checking your spelling or using different keywords.`
                : "Type above to search across all our products and categories."}
            </Text>
          </ScrollView>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            numColumns={2}
            contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            onRefresh={refetch}
            refreshing={isRefetching}
            ListHeaderComponent={
              <View className="px-3 py-4">
                <Text className="text-sm text-gray-500 font-medium">
                  Found {data?.total || products.length} results for "{debouncedSearch}"
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
