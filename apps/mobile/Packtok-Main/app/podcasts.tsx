import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Mock podcast data - will be replaced with API data later
const MOCK_PODCASTS = [
  {
    id: "1",
    title: "The Future of Packaging Technology",
    description:
      "Exploring innovations in sustainable packaging and automation",
    videoId: "VXvblzAs6vM",
    thumbnail: `https://img.youtube.com/vi/VXvblzAs6vM/maxresdefault.jpg`,
    duration: "45:32",
    likes: 245,
    comments: 32,
    tags: ["Technology", "Innovation", "Sustainability"],
    publishedAt: "2024-03-15",
  },
  {
    id: "2",
    title: "Industry Insights: Manufacturing Excellence",
    description: "Best practices in modern manufacturing and quality control",
    videoId: "c8VcUnz3nVc",
    thumbnail: `https://img.youtube.com/vi/c8VcUnz3nVc/maxresdefault.jpg`,
    duration: "38:20",
    likes: 189,
    comments: 24,
    tags: ["Manufacturing", "Quality", "Best Practices"],
    publishedAt: "2024-03-10",
  },
  {
    id: "3",
    title: "Machinery Maintenance Best Practices",
    description:
      "Expert tips on maintaining industrial machinery for optimal performance",
    videoId: "yVTNge3sXpg",
    thumbnail: `https://img.youtube.com/vi/yVTNge3sXpg/maxresdefault.jpg`,
    duration: "42:15",
    likes: 312,
    comments: 45,
    tags: ["Maintenance", "Machinery", "Tips"],
    publishedAt: "2024-03-08",
  },
  {
    id: "4",
    title: "Sustainable Packaging Solutions",
    description: "How eco-friendly packaging is reshaping the industry",
    videoId: "r8pDXO6zRUg",
    thumbnail: `https://img.youtube.com/vi/r8pDXO6zRUg/maxresdefault.jpg`,
    duration: "35:48",
    likes: 421,
    comments: 56,
    tags: ["Sustainability", "Packaging", "Environment"],
    publishedAt: "2024-03-05",
  },
  {
    id: "5",
    title: "Digital Transformation in Manufacturing",
    description: "Leveraging AI and IoT for smarter production",
    videoId: "QoAoefT3VJc",
    thumbnail: `https://img.youtube.com/vi/QoAoefT3VJc/maxresdefault.jpg`,
    duration: "50:12",
    likes: 567,
    comments: 78,
    tags: ["Digital", "AI", "IoT", "Manufacturing"],
    publishedAt: "2024-03-01",
  },
];

export default function PodcastsScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter podcasts based on search term
  const filteredPodcasts = MOCK_PODCASTS.filter(
    (podcast) =>
      podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handlePodcastPress = (podcastId: string) => {
    router.push(`/podcasts/${podcastId}` as any);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header with Logo and Bubbles */}
      <View className="bg-white relative overflow-hidden">
        {/* Background Bubbles */}
        <Image
          source={require("@/assets/images/bubble 01.png")}
          className="absolute"
          style={{
            top: -width * 0.2,
            left: -width * 0.3,
            width: width * 0.6,
            height: width * 0.6,
            opacity: 0.5,
          }}
          resizeMode="contain"
        />

        <Image
          source={require("@/assets/images/bubble 02.png")}
          className="absolute"
          style={{
            top: width * 0.15,
            left: -width * 0.25,
            width: width * 0.55,
            height: width * 0.55,
            opacity: 0.4,
          }}
          resizeMode="contain"
        />

        {/* Header Content */}
        <View className="px-5 pt-12 pb-4 z-10">
          {/* Top Bar */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center bg-white/80 rounded-full shadow-sm"
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>

            <View className="flex-row items-center space-x-3">
              <TouchableOpacity className="relative">
                <Feather name="bell" size={22} color="#000" />
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">2</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="ml-3">
                <Feather name="shopping-cart" size={22} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logo */}
          <View className="items-center mb-4">
            <Image
              source={require("@/assets/images/logo-removebg.png")}
              style={{ width: 180, height: 60 }}
              resizeMode="contain"
            />
          </View>

          {/* Page Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Podcasts
          </Text>
          <Text className="text-sm text-gray-600 mb-4">
            Industry insights and expert discussions
          </Text>

          {/* Search Bar */}
          <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm">
            <Feather name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search podcasts..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-base text-gray-900"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm("")}>
                <Feather name="x" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Podcasts List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-5 pt-4">
          {/* Results Count */}
          <Text className="text-sm text-gray-600 mb-4">
            {filteredPodcasts.length}{" "}
            {filteredPodcasts.length === 1 ? "podcast" : "podcasts"} found
          </Text>

          {/* Podcast Cards */}
          {filteredPodcasts.map((podcast) => (
            <TouchableOpacity
              key={podcast.id}
              className="mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              onPress={() => handlePodcastPress(podcast.id)}
              activeOpacity={0.7}
            >
              {/* Thumbnail */}
              <View className="relative">
                <Image
                  source={{ uri: podcast.thumbnail }}
                  style={{ width: "100%", height: 200 }}
                  resizeMode="cover"
                />
                {/* Duration Badge */}
                <View className="absolute bottom-3 right-3 bg-black/80 rounded-lg px-2 py-1">
                  <Text className="text-white text-xs font-semibold">
                    {podcast.duration}
                  </Text>
                </View>
                {/* Play Icon Overlay */}
                <View className="absolute inset-0 items-center justify-center">
                  <View className="w-16 h-16 rounded-full bg-white/90 items-center justify-center shadow-lg">
                    <Feather name="play" size={28} color="#000" />
                  </View>
                </View>
              </View>

              {/* Content */}
              <View className="p-4">
                {/* Title */}
                <Text
                  className="text-lg font-bold text-gray-900 mb-2"
                  numberOfLines={2}
                >
                  {podcast.title}
                </Text>

                {/* Description */}
                <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
                  {podcast.description}
                </Text>

                {/* Tags */}
                <View className="flex-row flex-wrap mb-3">
                  {podcast.tags.slice(0, 3).map((tag, index) => (
                    <View
                      key={index}
                      className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
                    >
                      <Text className="text-xs text-gray-700 font-medium">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Stats Row */}
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <View className="flex-row items-center">
                    <Feather name="heart" size={16} color="#EF4444" />
                    <Text className="text-sm text-gray-600 ml-1">
                      {podcast.likes}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="message-circle" size={16} color="#3B82F6" />
                    <Text className="text-sm text-gray-600 ml-1">
                      {podcast.comments}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500">
                    {new Date(podcast.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* No Results */}
          {filteredPodcasts.length === 0 && (
            <View className="items-center justify-center py-20">
              <Feather name="search" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 text-base mt-4">
                No podcasts found
              </Text>
              <Text className="text-gray-400 text-sm mt-2">
                Try adjusting your search terms
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
