import QuoteModal from "@/components/QuoteModal";
import { useProduct } from "@/hooks/useProducts";
import {
  useAddBookmark,
  useCheckBookmark,
  useRemoveBookmark,
  useTrackProductView,
} from "@/hooks/useUserTracking";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Machine Type Badge Component - Shows MONO_CARTON, MASTER_CARTON, BOTH, OTHER
const MachineTypeBadge = ({ type }: { type: string }) => {
  const getTypeConfig = () => {
    switch (type) {
      case "MONO_CARTON":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          label: "Mono Carton",
        };
      case "MASTER_CARTON":
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-700",
          label: "Master Carton",
        };
      case "BOTH":
        return { bg: "bg-blue-100", text: "text-blue-700", label: "Both" };
      case "OTHER":
        return { bg: "bg-gray-100", text: "text-gray-700", label: "Other" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", label: type };
    }
  };

  const config = getTypeConfig();
  return (
    <View className={`px-3 py-1.5 rounded-full ${config.bg}`}>
      <Text className={`text-xs font-semibold ${config.text}`}>
        {config.label}
      </Text>
    </View>
  );
};

export default function RawMaterialDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const viewStartTime = useRef(Date.now());

  const { data: product, isLoading, error } = useProduct(id!);

  // User tracking hooks
  const { data: bookmarkStatus } = useCheckBookmark(id!);
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();
  const trackView = useTrackProductView();

  const isBookmarked = bookmarkStatus?.isBookmarked || false;

  // Track product view on mount and duration on unmount
  useEffect(() => {
    if (id) {
      // Track initial view
      trackView.mutate({ productId: id });
      viewStartTime.current = Date.now();

      // Track duration on unmount
      return () => {
        const durationSeconds = Math.floor(
          (Date.now() - viewStartTime.current) / 1000
        );
        if (durationSeconds > 0) {
          trackView.mutate({ productId: id, durationSeconds });
        }
      };
    }
  }, [id]);

  // Initialize video player with the product video URL
  const videoPlayer = useVideoPlayer(product?.videoUrl || "", (player) => {
    player.loop = true;
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this product: ${product?.title}\n${product?.description || ""}`,
        title: product?.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleBookmarkToggle = () => {
    if (!id) return;

    // Animate the button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Toggle bookmark
    if (isBookmarked) {
      removeBookmark.mutate(id, {
        onSuccess: () => {
          Alert.alert("Removed", "Product removed from wishlist");
        },
        onError: () => {
          Alert.alert("Error", "Failed to remove bookmark");
        },
      });
    } else {
      addBookmark.mutate(id, {
        onSuccess: () => {
          Alert.alert("Saved", "Product added to wishlist!");
        },
        onError: () => {
          Alert.alert("Error", "Failed to add bookmark");
        },
      });
    }
  };

  const handleGetQuote = () => {
    setQuoteModalVisible(true);
  };

  const handleOpenPdf = () => {
    if (product?.pdfUrl) {
      Linking.openURL(product.pdfUrl).catch(() => {
        Alert.alert("Error", "Unable to open PDF document");
      });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF6B2C" />
        <Text className="mt-4 text-gray-600 text-base">
          Loading product details...
        </Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Feather name="alert-circle" size={64} color="#EF4444" />
        <Text className="mt-4 text-xl font-bold text-gray-900">
          Product Not Found
        </Text>
        <Text className="mt-2 text-center text-gray-600 text-base">
          Unable to load product details. Please try again.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-orange-500 px-8 py-4 rounded-xl"
          style={styles.shadow}
        >
          <Text className="text-white font-bold text-base">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = product.images || [];
  const hasVideo = !!product.videoUrl;
  const hasPdf = !!product.pdfUrl;
  const imageViewerData = images.map((url) => ({ url }));

  return (
    <View className="flex-1 bg-gray-50">
      {/* Premium Header */}
      <View className="bg-white" style={styles.headerShadow}>
        <View className="px-4 pt-12 pb-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-11 h-11 items-center justify-center bg-gray-100 rounded-full"
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={22} color="#000" />
            </TouchableOpacity>
            <Text className="text-gray-900 text-base font-semibold">
              Product Details
            </Text>
            <TouchableOpacity
              onPress={handleShare}
              className="w-11 h-11 items-center justify-center bg-gray-100 rounded-full"
              activeOpacity={0.7}
            >
              <Feather name="share-2" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Premium Image Gallery with Zoom */}
        {images.length > 0 && (
          <View className="bg-white mb-2">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setImageViewerVisible(true)}
            >
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
                  <View key={index} className="bg-white relative">
                    <Image
                      source={{ uri: image }}
                      style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-4 right-4 bg-black/60 px-3 py-2 rounded-full flex-row items-center">
                      <Feather name="maximize-2" size={14} color="white" />
                      <Text className="text-white text-xs ml-1 font-medium">
                        Tap to zoom
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </TouchableOpacity>

            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
              <View className="bg-black/50 px-3 py-1.5 rounded-full flex-row">
                {images.map((_, index) => (
                  <View
                    key={index}
                    className={`h-1.5 rounded-full mx-0.5 ${index === activeImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
                  />
                ))}
              </View>
            </View>

            <View className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-full">
              <Text className="text-white text-xs font-semibold">
                {activeImageIndex + 1}/{images.length}
              </Text>
            </View>
          </View>
        )}

        {/* Product Title & Badges */}
        <View className="bg-white px-4 py-4 mb-2">
          <Text className="text-2xl font-bold text-gray-900 mb-3 leading-8">
            {product.title}
          </Text>

          <View className="flex-row flex-wrap items-center mb-3">
            {product.condition && (
              <View
                className={`px-3 py-1.5 rounded-full mr-2 mb-2 ${product.condition === "NEW" ? "bg-green-100" : "bg-blue-100"}`}
              >
                <Text
                  className={`text-xs font-bold ${product.condition === "NEW" ? "text-green-700" : "text-blue-700"}`}
                >
                  {product.condition}
                </Text>
              </View>
            )}

            {product.machineType && (
              <View className="mb-2 mr-2">
                <MachineTypeBadge type={product.machineType} />
              </View>
            )}

            {product.category && (
              <View className="bg-orange-50 px-3 py-1.5 rounded-full mb-2">
                <Text className="text-xs font-semibold text-orange-700">
                  {product.category.name}
                </Text>
              </View>
            )}
          </View>

          {product.price && (
            <View className="flex-row items-end">
              <Text className="text-3xl font-bold text-orange-500">
                ₹{product.price.toLocaleString("en-IN")}
              </Text>
              <Text className="text-gray-500 text-base ml-2 mb-1">+ GST</Text>
            </View>
          )}
        </View>

        {/* Quick Actions - Video & PDF */}
        <View className="bg-white px-4 py-3 mb-2">
          <View className="flex-row justify-between">
            {hasVideo && (
              <TouchableOpacity
                onPress={() => setVideoModalVisible(true)}
                className="flex-1 flex-row items-center justify-center bg-red-50 border border-red-200 rounded-xl py-3 mr-2"
                activeOpacity={0.7}
                style={styles.shadow}
              >
                <Ionicons name="play-circle" size={22} color="#DC2626" />
                <Text className="ml-2 text-red-600 font-bold text-sm">
                  Watch Video
                </Text>
              </TouchableOpacity>
            )}
            {hasPdf && (
              <TouchableOpacity
                onPress={handleOpenPdf}
                className="flex-1 flex-row items-center justify-center bg-blue-50 border border-blue-200 rounded-xl py-3 ml-2"
                activeOpacity={0.7}
                style={styles.shadow}
              >
                <Feather name="file-text" size={20} color="#2563EB" />
                <Text className="ml-2 text-blue-600 font-bold text-sm">
                  View PDF
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Description */}
        {product.description && (
          <View className="bg-white px-4 py-4 mb-2">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Description
            </Text>
            <Text className="text-gray-700 leading-6 text-base">
              {product.description}
            </Text>
          </View>
        )}

        {/* Product Information */}
        {product.manufacturer && (
          <View className="bg-white px-4 py-4 mb-2">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Product Information
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-center py-2">
                <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mr-3">
                  <Feather name="package" size={20} color="#FF6B2C" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-0.5">
                    Manufacturer
                  </Text>
                  <Text className="text-gray-900 font-semibold text-base">
                    {product.manufacturer}
                  </Text>
                </View>
              </View>

              {product.model && (
                <View className="flex-row items-center py-2">
                  <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
                    <Feather name="tag" size={20} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-gray-500 mb-0.5">
                      Model Number
                    </Text>
                    <Text className="text-gray-900 font-semibold text-base">
                      {product.model}
                    </Text>
                  </View>
                </View>
              )}

              {product.year && (
                <View className="flex-row items-center py-2">
                  <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mr-3">
                    <Feather name="calendar" size={20} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-gray-500 mb-0.5">
                      Manufacturing Year
                    </Text>
                    <Text className="text-gray-900 font-semibold text-base">
                      {product.year}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Specifications */}
        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <View className="bg-white px-4 py-4 mb-2">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Technical Specifications
              </Text>
              <View className="bg-gray-50 rounded-xl p-3">
                {Object.entries(product.specifications).map(
                  ([key, value], index) => (
                    <View
                      key={index}
                      className={`flex-row justify-between py-3 px-2 ${index < Object.keys(product.specifications).length - 1 ? "border-b border-gray-200" : ""}`}
                    >
                      <Text className="text-gray-600 font-medium text-sm capitalize flex-1">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Text>
                      <Text className="text-gray-900 font-bold text-sm flex-1 text-right">
                        {String(value)}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          )}

        {/* Additional Info */}
        <View className="bg-white px-4 py-4 mb-2">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Additional Details
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center py-2">
              <Feather name="hash" size={16} color="#6B7280" />
              <Text className="ml-2 text-sm text-gray-600">Product ID: </Text>
              <Text className="text-sm text-gray-900 font-semibold">
                {product.id}
              </Text>
            </View>
            {product.createdAt && (
              <View className="flex-row items-center py-2">
                <Feather name="clock" size={16} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-600">Listed on: </Text>
                <Text className="text-sm text-gray-900 font-semibold">
                  {new Date(product.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Premium Bottom Action Bar */}
      <View
        className="bg-white border-t border-gray-100 px-4 py-3"
        style={styles.bottomBarShadow}
      >
        <View className="flex-row items-center">
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={handleBookmarkToggle}
              className={`w-14 h-14 items-center justify-center rounded-xl mr-3 ${
                isBookmarked
                  ? "bg-red-50 border-2 border-red-500"
                  : "bg-gray-100"
              }`}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={isBookmarked ? "favorite" : "favorite-border"}
                size={28}
                color={isBookmarked ? "#EF4444" : "#6B7280"}
              />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            onPress={handleGetQuote}
            className="flex-1 bg-orange-500 rounded-xl py-4 items-center justify-center"
            activeOpacity={0.8}
            style={styles.quoteShadow}
          >
            <View className="flex-row items-center">
              <MaterialIcons name="request-quote" size={24} color="white" />
              <Text className="text-white text-lg font-bold ml-2">
                Get Quote
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Zoom Modal */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <ImageViewer
          imageUrls={imageViewerData}
          index={activeImageIndex}
          onSwipeDown={() => setImageViewerVisible(false)}
          enableSwipeDown={true}
          backgroundColor="black"
          renderHeader={() => (
            <View className="absolute top-12 right-4 z-50">
              <TouchableOpacity
                onPress={() => setImageViewerVisible(false)}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              >
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
          renderIndicator={(currentIndex, allSize) => (
            <View className="absolute bottom-12 left-0 right-0 items-center">
              <View className="bg-black/60 px-4 py-2 rounded-full">
                <Text className="text-white font-semibold">
                  {currentIndex}/{allSize}
                </Text>
              </View>
            </View>
          )}
        />
      </Modal>

      {/* Video Player Modal */}
      <Modal
        visible={videoModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setVideoModalVisible(false);
          videoPlayer.pause();
        }}
      >
        <View className="flex-1 bg-black">
          <View
            className="absolute top-0 left-0 right-0 z-50 px-4 pt-12 pb-6"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          >
            <View className="flex-row items-center justify-between">
              <Text
                className="text-white text-lg font-semibold flex-1"
                numberOfLines={1}
              >
                {product.title}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVideoModalVisible(false);
                  videoPlayer.pause();
                }}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center ml-3"
              >
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-1 justify-center items-center">
            {hasVideo && product.videoUrl && (
              <VideoView
                player={videoPlayer}
                style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * (9 / 16) }}
                contentFit="contain"
                fullscreenOptions={{ enable: true }}
                allowsPictureInPicture
              />
            )}
          </View>
        </View>
      </Modal>

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

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomBarShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  quoteShadow: {
    shadowColor: "#FF6B2C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
});
