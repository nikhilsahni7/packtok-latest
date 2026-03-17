import FloatingCartBar from "@/components/FloatingCartBar";
import QuoteModal from "@/components/QuoteModal";
import ReviewsSection from "@/components/ReviewsSection";
import {
  useAddToCart,
  useCartQuery,
  useRemoveFromCart,
  useUpdateCartItem,
} from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProducts";
import { useReviewStats } from "@/hooks/useReviews";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Machine Type Badge
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

const getCurrencySymbol = (currency?: string) => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "AED":
      return "AED";
    case "CNY":
      return "¥";
    case "INR":
    default:
      return "₹";
  }
};

export default function SparePartsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const viewStartTime = useRef(Date.now());
  const insets = useSafeAreaInsets();

  const { data: product, isLoading, error } = useProduct(id!);
  const { data: cart } = useCartQuery();
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const { data: reviewStats } = useReviewStats(id!);

  const { data: bookmarkStatus } = useCheckBookmark(id!);
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();
  const trackView = useTrackProductView();

  const isBookmarked = bookmarkStatus?.isBookmarked || false;
  const isCartEnabled = !!product?.cartEnabled;
  const shouldShowPrice = product?.displayPrice !== false;
  const currency = product?.currency || "INR";

  useEffect(() => {
    if (id) {
      trackView.mutate({ productId: id });
      viewStartTime.current = Date.now();
      return () => {
        const durationSeconds = Math.floor(
          (Date.now() - viewStartTime.current) / 1000,
        );
        if (durationSeconds > 0)
          trackView.mutate({ productId: id, durationSeconds });
      };
    }
  }, [id]);

  const videoPlayer = useVideoPlayer(product?.videoUrl || "", (player) => {
    player.loop = true;
  });

  const handleShare = async () => {
    try {
      const url = `https://packtok.com/marketplace/spare-parts/${id}`;
      await Share.share({
        message: `Check out: ${product?.title}\n${url}`,
        title: product?.title,
        url,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleBookmarkToggle = () => {
    if (!id) return;
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
    if (isBookmarked) {
      removeBookmark.mutate(id, {
        onSuccess: () =>
          Toast.show({
            type: "success",
            text1: "Removed from Wishlist",
            text2: "This product has been removed from your wishlist 💔",
            visibilityTime: 2000,
          }),
        onError: () =>
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to remove from wishlist. Please try again.",
            visibilityTime: 2500,
          }),
      });
    } else {
      addBookmark.mutate(id, {
        onSuccess: () =>
          Toast.show({
            type: "success",
            text1: "Added to Wishlist",
            text2: "This product has been saved to your wishlist ❤️",
            visibilityTime: 2000,
          }),
        onError: () =>
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Failed to add to wishlist. Please try again.",
            visibilityTime: 2500,
          }),
      });
    }
  };

  const handleGetQuote = () => setQuoteModalVisible(true);
  const cartItem = cart?.items?.find((item) => item.productId === id);
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (!id) return;
    addToCart.mutate({ productId: id, quantity: 1 });
  };

  const handleIncrement = () => {
    if (!id) return;
    if (currentQuantity >= (product?.quantity ?? 0)) {
      Toast.show({ type: "info", text1: "Max stock reached" });
      return;
    }
    updateCartItem.mutate({ productId: id, quantity: currentQuantity + 1 });
  };

  const handleDecrement = () => {
    if (!id) return;
    if (currentQuantity <= 1) {
      removeFromCart.mutate(id);
    } else {
      updateCartItem.mutate({ productId: id, quantity: currentQuantity - 1 });
    }
  };
  const handleOpenPdf = () => {
    if (product?.pdfUrl)
      Linking.openURL(product.pdfUrl).catch(() =>
        Alert.alert("Error", "Unable to open PDF"),
      );
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
          Unable to load product details.
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
  const faqs = product.faqs || [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
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
        {/* Image Gallery */}
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
                  setActiveImageIndex(
                    Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH),
                  );
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

        {/* Rating */}
        {reviewStats && reviewStats.totalReviews > 0 && (
          <View className="bg-white px-4 pt-3 pb-0">
            <View className="flex-row items-center">
              <View className="flex-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <MaterialIcons
                    key={star}
                    name="star"
                    size={18}
                    color={
                      star <= Math.round(reviewStats.averageRating)
                        ? "#F59E0B"
                        : "#D1D5DB"
                    }
                  />
                ))}
              </View>
              <Text className="text-sm text-gray-600 ml-2">
                {reviewStats.averageRating.toFixed(1)} (
                {reviewStats.totalReviews} review
                {reviewStats.totalReviews !== 1 ? "s" : ""})
              </Text>
            </View>
          </View>
        )}

        {/* Title & Badges */}
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
              <View className="bg-orange-50 px-3 py-1.5 rounded-full mb-2 mr-2">
                <Text className="text-xs font-semibold text-orange-700">
                  {product.category.name}
                </Text>
              </View>
            )}
            {product.subCategory && (
              <View className="bg-amber-50 px-3 py-1.5 rounded-full mb-2">
                <Text className="text-xs font-semibold text-amber-700">
                  {product.subCategory}
                </Text>
              </View>
            )}
          </View>
          {shouldShowPrice && product.price && (
            <View className="flex-row items-end">
              <Text className="text-3xl font-bold text-orange-500">
                {getCurrencySymbol(currency)}{" "}
                {Number(product.price).toLocaleString()}
              </Text>
              {(product.quantity ?? 0) > 0 ? (
                <Text className="text-green-600 text-sm font-medium ml-3 mb-1">
                  In Stock
                </Text>
              ) : (
                <Text className="text-red-600 text-sm font-bold ml-3 mb-1">
                  Out of Stock
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        {(hasVideo || hasPdf) && (
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
        )}

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
        {(product.manufacturer || product.model || product.year) && (
          <View className="bg-white px-4 py-4 mb-2">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Product Information
            </Text>
            <View className="space-y-3">
              {product.manufacturer && (
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
              )}
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
                    <Text className="text-xs text-gray-500 mb-0.5">Year</Text>
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
                  ),
                )}
              </View>
            </View>
          )}

        {/* Additional Details */}
        <View className="bg-white px-4 py-4 mb-2">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Additional Details
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center py-2">
              <Feather name="hash" size={16} color="#6B7280" />
              <Text className="ml-2 text-sm text-gray-600">SKU: </Text>
              <Text className="text-sm text-gray-900 font-semibold">
                {product.id.slice(-8).toUpperCase()}
              </Text>
            </View>
            {product.category && (
              <View className="flex-row items-center py-2">
                <Feather name="layers" size={16} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-600">Category: </Text>
                <Text className="text-sm text-gray-900 font-semibold">
                  {product.category.name}
                </Text>
              </View>
            )}
            {product.subCategory && (
              <View className="flex-row items-center py-2">
                <Feather name="grid" size={16} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-600">
                  Subcategory:{" "}
                </Text>
                <Text className="text-sm text-gray-900 font-semibold">
                  {product.subCategory}
                </Text>
              </View>
            )}
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

        {/* Additional Info */}
        {product.additionalInfo && (
          <View className="bg-white px-4 py-4 mb-2">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Additional Info
            </Text>
            <Text className="text-gray-700 leading-6 text-sm">
              {product.additionalInfo}
            </Text>
          </View>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <View className="bg-white px-4 py-4 mb-2">
            <View className="flex-row items-center mb-4">
              <Feather name="help-circle" size={22} color="#374151" />
              <Text className="text-lg font-bold text-gray-900 ml-2">
                Frequently Asked Questions
              </Text>
            </View>
            {faqs.map(
              (faq: { question: string; answer: string }, index: number) => (
                <View
                  key={index}
                  className="border border-gray-200 rounded-lg mb-2 overflow-hidden"
                >
                  <TouchableOpacity
                    onPress={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="flex-row items-center justify-between p-4"
                    activeOpacity={0.7}
                  >
                    <Text className="font-medium text-gray-900 flex-1 mr-2">
                      {faq.question}
                    </Text>
                    <Feather
                      name={
                        expandedFaq === index ? "chevron-up" : "chevron-down"
                      }
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                  {expandedFaq === index && (
                    <View className="px-4 pb-4">
                      <Text className="text-gray-600 leading-6">
                        {faq.answer}
                      </Text>
                    </View>
                  )}
                </View>
              ),
            )}
          </View>
        )}

        {/* Reviews */}
        <ReviewsSection productId={product.id} />

        <View className="h-24" />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        className="bg-white border-t border-gray-100 px-4 py-3"
        style={[
          styles.bottomBarShadow,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View className="flex-row items-center">
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={handleBookmarkToggle}
              className={`w-14 h-14 items-center justify-center rounded-xl mr-3 ${isBookmarked ? "bg-red-50 border-2 border-red-500" : "bg-gray-100"}`}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={isBookmarked ? "favorite" : "favorite-border"}
                size={28}
                color={isBookmarked ? "#EF4444" : "#6B7280"}
              />
            </TouchableOpacity>
          </Animated.View>
          {isCartEnabled ? (
            currentQuantity > 0 ? (
              <View
                className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-2 py-2"
                style={styles.quoteShadow}
              >
                <TouchableOpacity
                  onPress={handleDecrement}
                  className="flex-1 h-12 bg-white rounded-lg items-center justify-center shadow-sm"
                  activeOpacity={0.7}
                  disabled={
                    updateCartItem.isPending || removeFromCart.isPending
                  }
                >
                  <Feather name="minus" size={20} color="#374151" />
                </TouchableOpacity>
                <View className="w-16 items-center justify-center">
                  {updateCartItem.isPending || removeFromCart.isPending ? (
                    <ActivityIndicator color="#FF6B2C" />
                  ) : (
                    <Text className="text-xl font-bold text-gray-900">
                      {currentQuantity}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={handleIncrement}
                  className="flex-1 h-12 bg-white rounded-lg items-center justify-center shadow-sm"
                  activeOpacity={0.7}
                  disabled={
                    updateCartItem.isPending ||
                    currentQuantity >= (product?.quantity ?? 0)
                  }
                >
                  <Feather name="plus" size={20} color="#374151" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleAddToCart}
                className="flex-1 bg-gray-900 rounded-xl py-4 items-center justify-center"
                activeOpacity={0.8}
                style={styles.quoteShadow}
                disabled={(product.quantity ?? 0) <= 0 || addToCart.isPending}
              >
                <View className="flex-row items-center">
                  {addToCart.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Feather name="shopping-cart" size={22} color="white" />
                      <Text className="text-white text-lg font-bold ml-2">
                        Add to Cart
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            )
          ) : (
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
          )}
        </View>
      </View>

      {/* Modals */}
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

      <QuoteModal
        visible={quoteModalVisible}
        onClose={() => setQuoteModalVisible(false)}
        productId={product.id}
        productTitle={product.title}
      />

      <FloatingCartBar />
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
