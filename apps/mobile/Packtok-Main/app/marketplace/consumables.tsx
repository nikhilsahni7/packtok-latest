import FilterModal, { FilterState } from "@/components/FilterModal";
import { useProducts } from "@/hooks/useProducts";
import { useTrackSearch } from "@/hooks/useUserTracking";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Category tabs with routes
const categories = [
  { name: "Machinery", route: "/marketplace/machinery" },
  { name: "Spare Parts", route: "/marketplace/spare-parts" },
  { name: "Raw Material", route: "/marketplace/raw-material" },
  { name: "Consumables", route: "/marketplace/consumables" },
];

export default function ConsumablesScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );
  const [filterState, setFilterState] = useState<FilterState>({
    categories: [],
    priceRanges: [],
    conditions: [],
    machineTypes: [],
  });

  const trackSearch = useTrackSearch();

  const handleConditionFilter = (condition: string) => {
    setSelectedCondition(selectedCondition === condition ? null : condition);
  };

  // Build filters for API matching web implementation
  const apiFilters = useMemo(() => {
    const filters: any = {
      productType: "CONSUMABLES", // Always filter by CONSUMABLES type
      searchTerm: searchTerm || undefined,
      page: 1,
      limit: 50,
    };

    // Add category filters
    if (filterState.categories.length > 0) {
      filters.categoryId = filterState.categories;
    }

    // Add condition filters (NEW/USED)
    const allConditions = [
      ...(selectedCondition ? [selectedCondition] : []),
      ...filterState.conditions,
    ];
    if (allConditions.length > 0) {
      filters.condition = allConditions;
    }

    // Add machine type filters
    if (filterState.machineTypes.length > 0) {
      filters.machineType = filterState.machineTypes;
    }

    // Add price range filters
    if (filterState.priceRanges.length > 0) {
      const allMins = filterState.priceRanges
        .map((r) => parseInt(r.split("-")[0]))
        .filter((n) => !isNaN(n));
      const allMaxs = filterState.priceRanges
        .map((r) => {
          const parts = r.split("-");
          return parts[1] ? parseInt(parts[1]) : Infinity;
        })
        .filter((n) => !isNaN(n));

      if (allMins.length > 0) {
        filters.priceMin = Math.min(...allMins) * 100000; // Convert lakhs to rupees
      }
      if (allMaxs.length > 0 && allMaxs.some((m) => m !== Infinity)) {
        filters.priceMax =
          Math.max(...allMaxs.filter((m) => m !== Infinity)) * 100000;
      }
    }

    return filters;
  }, [filterState, selectedCondition, searchTerm]);

  // Fetch products
  const { data, isLoading, error, refetch } = useProducts(apiFilters);
  const products = data?.products || [];
  const isError = !!error;

  // Track search when search term changes
  useEffect(() => {
    if (searchTerm && searchTerm.length > 2) {
      const timer = setTimeout(() => {
        trackSearch.mutate({
          searchTerm,
          filters: apiFilters,
          resultsCount: data?.total,
        });
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, data?.total]);

  const renderStars = (rating: number = 5) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialIcons
            key={star}
            name="star"
            size={14}
            color={star <= rating ? "#000" : "#D1D5DB"}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header - White with logo */}
      <View className="bg-white px-4 pt-12  ">
        <View className="flex-row items-center justify-between">
          {/* Menu Icon */}
          <TouchableOpacity
            className="w-10 h-10 items-center bg-[#F2F2F2] rounded-full  justify-center"
            onPress={() => router.back()}
          >
            <Feather name="menu" size={24} color="#000" />
          </TouchableOpacity>

          {/* Logo */}
          <Image
            source={require("@/assets/images/logo-removebg.png")}
            style={{ width: 200, height: 100 }}
            resizeMode="contain"
          />

          {/* Right Icons */}
          <View className="flex-row items-center">
            {/* Notification Bell */}
            <TouchableOpacity className="relative w-10 h-10 items-center justify-center mr-1">
              <Feather name="bell" size={22} color="black" />
              <View className="absolute top-2 right-2 bg-red-500 rounded-full w-2 h-2" />
            </TouchableOpacity>

            {/* Shopping Cart */}
            <TouchableOpacity className="w-10 h-10 items-center justify-center">
              <Feather name="shopping-cart" size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View className="px-4 pt-4 pb-3 bg-white">
          <View className="flex-row items-center bg-white border  rounded-full px-4 py-3 z-10">
            <Feather name="search" size={20} color="#9CA3AF" className="" />
            <TextInput
              placeholder="Search any Product..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-base text-gray-900"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <TouchableOpacity>
              <Feather name="mic" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Tabs - Horizontal Scroll */}
        <View className="bg-white pt-3 pb-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                className={`px-5 py-2 rounded-[15px] mr-3 ${
                  index === 3
                    ? "bg-gray-900 border-2 border-gray-900"
                    : "bg-white border-2 border-gray-200"
                }`}
                activeOpacity={0.7}
                onPress={() => {
                  if (category.route) {
                    router.push(category.route as any);
                  }
                }}
              >
                <Text
                  className={`text-sm font-medium ${
                    index === 3 ? "text-white" : "text-gray-700"
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filter Options */}
        <View className="bg-white pt-2 flex flex-row  justify-between pb-4 border-b border-gray-100">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {/* Filter Button */}
            <View className=" flex-row   items-center">
              <TouchableOpacity
                className="flex-row items-center px-4 py-2 text-[16px] rounded-full mr-3 bg-white "
                activeOpacity={0.7}
                onPress={() => setFilterModalVisible(true)}
              >
                <Feather name="sliders" size={16} color="#000" />
                <Text className="text-sm text-gray-700 ml-2">Filter</Text>
              </TouchableOpacity>

              {/* New Button */}
              <View className="flex flex-row">
                <TouchableOpacity
                  className={` px-4 py-2 rounded-[15px] mr-3 ${
                    selectedCondition === "NEW"
                      ? "bg-gray-900 border-2 border-gray-900"
                      : "bg-white border border-gray-200"
                  }`}
                  activeOpacity={0.7}
                  onPress={() => handleConditionFilter("NEW")}
                >
                  <Text
                    className={`text-sm ${
                      selectedCondition === "NEW" ? "text-white" : "text-black"
                    }`}
                  >
                    New
                  </Text>
                </TouchableOpacity>

                {/* Used Button */}
                <TouchableOpacity
                  className={`px-4 py-2 rounded-[15px] mr-3 ${
                    selectedCondition === "USED"
                      ? "bg-gray-900 border-2 border-gray-900"
                      : "bg-white border border-gray-200"
                  }`}
                  activeOpacity={0.7}
                  onPress={() => handleConditionFilter("USED")}
                >
                  <Text
                    className={`text-sm ${
                      selectedCondition === "USED" ? "text-white" : "text-black"
                    }`}
                  >
                    Used
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Products Grid - 3 Columns */}
        <View className="px-3 pt-4 pb-6 bg-white">
          {isLoading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#FF8C42" />
              <Text className="text-gray-500 mt-4">Loading products...</Text>
            </View>
          ) : isError ? (
            <View className="py-20 items-center justify-center">
              <Feather name="alert-circle" size={48} color="#EF4444" />
              <Text className="text-gray-900 font-semibold mt-4 text-lg">
                Error loading products
              </Text>
              <TouchableOpacity
                onPress={() => refetch()}
                className="mt-4 px-6 py-3 bg-[#FF8C42] rounded-[15px]"
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : products.length === 0 ? (
            <View className="py-20 items-center justify-center">
              <Feather name="inbox" size={48} color="#9CA3AF" />
              <Text className="text-gray-900 font-semibold mt-4 text-lg">
                No products found
              </Text>
              <Text className="text-gray-500 mt-2 text-center px-8">
                Try adjusting your filters or search term
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  className=" rounded-[15px] overflow-hidden mb-4"
                  style={{
                    width: (width - 32) / 3 - 4,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push(`/marketplace/consumables/${product.id}` as any)
                  }
                >
                  {/* Product Image */}
                  <View className="bg-gray-100 w-full h-[140px]">
                    <Image
                      source={
                        product.imagesThumbnail || product.images?.[0]
                          ? {
                              uri: product.imagesThumbnail || product.images[0],
                            }
                          : require("@/assets/images/splash-screen-bg.png")
                      }
                      style={{ width: "100%", height: "100%" }}
                      className="rounded-[15px] h-[140px]"
                      resizeMode="cover"
                    />
                  </View>

                  {/* Product Details */}
                  <View className="p-2">
                    {/* Star Rating */}
                    <View className="mb-1">{renderStars()}</View>

                    {/* Product Name */}
                    <Text
                      className="text-xs text-gray-900 font-medium"
                      numberOfLines={2}
                    >
                      {product.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filterState={filterState}
        onFilterChange={setFilterState}
      />
    </View>
  );
}
