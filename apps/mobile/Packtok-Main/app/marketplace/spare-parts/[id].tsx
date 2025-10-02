import { useProduct } from "@/hooks/useProducts";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QuoteModal from "@/components/QuoteModal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function SparePartsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);

  const { data: product, isLoading, error } = useProduct(id!);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF6B2C" />
        <Text className="mt-4 text-gray-600">Loading product details...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Feather name="alert-circle" size={48} color="#EF4444" />
        <Text className="mt-4 text-lg font-semibold text-gray-900">
          Product Not Found
        </Text>
        <Text className="mt-2 text-center text-gray-600">
          Unable to load product details. Please try again.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-orange-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = product.images || [];
  const hasVideo = !!product.videoUrl;
  const hasPdf = !!product.pdfUrl;

  const handleGetQuote = () => {
    setQuoteModalVisible(true);
  };

  // Contact information removed as not available in backend schema

  const handleOpenPdf = () => {
    if (product.pdfUrl) {
      Linking.openURL(product.pdfUrl).catch(() => {
        Alert.alert("Error", "Unable to open PDF");
      });
    }
  };

  const handleOpenVideo = () => {
    if (product.videoUrl) {
      Linking.openURL(product.videoUrl).catch(() => {
        Alert.alert("Error", "Unable to open video");
      });
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-orange-500 px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center bg-white/20 rounded-full"
          >
            <Feather name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold flex-1 text-center">
            Product Details
          </Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center bg-white/20 rounded-full">
            <Feather name="share-2" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        {images.length > 0 && (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                setActiveImageIndex(index);
              }}
            >
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  className="bg-gray-100"
                  style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.75 }}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
            {/* Image Indicators */}
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {images.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 rounded-full mx-1 ${
                    index === activeImageIndex
                      ? "w-6 bg-orange-500"
                      : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </View>
          </View>
        )}

        {/* Product Info */}
        <View className="px-4 pt-4">
          {/* Title and Condition */}
          <View className="flex-row items-start justify-between mb-2">
            <Text className="flex-1 text-2xl font-bold text-gray-900 mr-2">
              {product.title}
            </Text>
            {product.condition && (
              <View
                className={`px-3 py-1 rounded-full ${
                  product.condition === "NEW"
                    ? "bg-green-100"
                    : product.condition === "USED"
                      ? "bg-blue-100"
                      : "bg-yellow-100"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    product.condition === "NEW"
                      ? "text-green-700"
                      : product.condition === "USED"
                        ? "text-blue-700"
                        : "text-yellow-700"
                  }`}
                >
                  {product.condition}
                </Text>
              </View>
            )}
          </View>

          {/* Price */}
          {product.price && (
            <Text className="text-3xl font-bold text-orange-500 mb-4">
              ₹{product.price.toLocaleString()}
            </Text>
          )}

          {/* Category */}
          {product.category && (
            <View className="flex-row items-center mb-4">
              <MaterialIcons name="category" size={20} color="#6B7280" />
              <Text className="ml-2 text-gray-600">
                {product.category.name}
              </Text>
            </View>
          )}

          {/* Description */}
          {product.description && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </Text>
              <Text className="text-gray-700 leading-6">
                {product.description}
              </Text>
            </View>
          )}

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-3">
                  Specifications
                </Text>
                <View className="bg-gray-50 rounded-lg p-4">
                  {Object.entries(product.specifications).map(
                    ([key, value], index) => (
                      <View
                        key={index}
                        className={`flex-row justify-between py-3 ${
                          index < Object.keys(product.specifications).length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }`}
                      >
                        <Text className="text-gray-600 font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </Text>
                        <Text className="text-gray-900 font-semibold flex-1 text-right ml-4">
                          {String(value)}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}

          {/* Media Buttons */}
          <View className="flex-row mb-6">
            {hasVideo && (
              <TouchableOpacity
                onPress={handleOpenVideo}
                className="flex-1 flex-row items-center justify-center bg-red-50 border border-red-200 rounded-lg py-3 mr-2"
              >
                <Feather name="video" size={20} color="#DC2626" />
                <Text className="ml-2 text-red-600 font-semibold">
                  Watch Video
                </Text>
              </TouchableOpacity>
            )}
            {hasPdf && (
              <TouchableOpacity
                onPress={handleOpenPdf}
                className="flex-1 flex-row items-center justify-center bg-blue-50 border border-blue-200 rounded-lg py-3 ml-2"
              >
                <Feather name="file-text" size={20} color="#2563EB" />
                <Text className="ml-2 text-blue-600 font-semibold">
                  View PDF
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Additional product information */}
          {product.manufacturer && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Product Information
              </Text>
              <View className="bg-gray-50 rounded-lg p-4">
                <View className="flex-row items-center mb-3">
                  <Feather name="package" size={20} color="#6B7280" />
                  <Text className="ml-3 text-gray-900">
                    Manufacturer: {product.manufacturer}
                  </Text>
                </View>
                {product.model && (
                  <View className="flex-row items-center mb-3">
                    <Feather name="tag" size={20} color="#6B7280" />
                    <Text className="ml-3 text-gray-900">
                      Model: {product.model}
                    </Text>
                  </View>
                )}
                {product.year && (
                  <View className="flex-row items-center">
                    <Feather name="calendar" size={20} color="#6B7280" />
                    <Text className="ml-3 text-gray-900">
                      Year: {product.year}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Additional Info */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Feather name="info" size={16} color="#6B7280" />
              <Text className="ml-2 text-sm text-gray-600">
                Product ID: {product.id}
              </Text>
            </View>
            {product.createdAt && (
              <View className="flex-row items-center">
                <Feather name="calendar" size={16} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-600">
                  Listed on{" "}
                  {new Date(product.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="bg-white border-t border-gray-200 px-4 py-4">
        <View className="flex-row">
          <TouchableOpacity className="w-12 h-12 items-center justify-center bg-gray-100 rounded-lg mr-3">
            <Feather name="heart" size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleGetQuote}
            className="flex-1 bg-orange-500 rounded-lg py-3 items-center justify-center"
            style={{
              shadowColor: "#FF6B2C",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text className="text-white text-lg font-bold">Get Quote</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quote Request Modal */}
      <QuoteModal
        visible={quoteModalVisible}
        onClose={() => setQuoteModalVisible(false)}
        productId={product.id}
        productTitle={product.title}
      />
    </View>
  );
}
