import PageHeader from "@/components/PageHeader";
import { usePodcasts } from "@/hooks/usePodcasts";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function PodcastsScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, isError } = usePodcasts({
    limit: 50,
    search: debouncedSearch || undefined,
    tags: selectedTag ? [selectedTag] : undefined,
  });
  const podcasts = data?.items ?? [];
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    podcasts.forEach((podcast) => {
      podcast.tags.forEach((tag) => {
        if (tag) tags.add(tag);
      });
    });
    if (selectedTag && !tags.has(selectedTag)) {
      tags.add(selectedTag);
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [podcasts, selectedTag]);

  const handlePodcastPress = (podcastId: string) => {
    router.push(`/podcasts/${podcastId}` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative" edges={["top"]}>
      <StatusBar style="dark" />

      {/* Unified Header with bubbles, dynamic cart, notifications, voice search */}
      <PageHeader
        onSearchChange={setSearchTerm}
        searchValue={searchTerm}
        searchPlaceholder="Search podcasts..."
      />

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <View className="bg-white px-5 py-3 border-b border-gray-100">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full mr-3 border ${
                  selectedTag === tag
                    ? "bg-orange-500 border-orange-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedTag === tag ? "text-white" : "text-gray-700"
                  }`}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Podcasts List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-5 pt-4">
          {isLoading && (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#FF8C42" />
              <Text className="text-gray-500 text-base mt-4">
                Loading podcasts...
              </Text>
            </View>
          )}

          {isError && !isLoading && (
            <View className="items-center justify-center py-20">
              <Feather name="alert-circle" size={48} color="#EF4444" />
              <Text className="text-gray-500 text-base mt-4">
                Failed to load podcasts
              </Text>
            </View>
          )}

          {!isLoading && !isError && (
            <>
              {/* Results Count */}
              <Text className="text-sm text-gray-600 mb-4">
                {podcasts.length}{" "}
                {podcasts.length === 1 ? "podcast" : "podcasts"} found
              </Text>

              {/* Podcast Cards */}
              {podcasts.map((podcast) => (
                <TouchableOpacity
                  key={podcast.id}
                  className="mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  onPress={() => handlePodcastPress(podcast.id)}
                  activeOpacity={0.7}
                >
                  {/* Thumbnail */}
                  <View className="relative">
                    <Image
                      source={
                        podcast.thumbnailUrl
                          ? { uri: podcast.thumbnailUrl }
                          : require("@/assets/images/article1.png")
                      }
                      style={{ width: "100%", height: 200 }}
                      resizeMode="cover"
                    />
                    {/* Duration Badge */}
                    {podcast.duration && (
                      <View className="absolute bottom-3 right-3 bg-black/80 rounded-lg px-2 py-1">
                        <Text className="text-white text-xs font-semibold">
                          {Math.floor(podcast.duration / 60)}:
                          {String(podcast.duration % 60).padStart(2, "0")}
                        </Text>
                      </View>
                    )}
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
                    <Text
                      className="text-sm text-gray-600 mb-3"
                      numberOfLines={2}
                    >
                      {podcast.description}
                    </Text>

                    {/* Tags */}
                    {podcast.tags.length > 0 && (
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
                    )}

                    {/* Stats Row */}
                    <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                      <View className="flex-row items-center">
                        <Feather name="heart" size={16} color="#EF4444" />
                        <Text className="text-sm text-gray-600 ml-1">
                          {podcast.likeCount}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Feather
                          name="message-circle"
                          size={16}
                          color="#3B82F6"
                        />
                        <Text className="text-sm text-gray-600 ml-1">
                          {podcast.commentCount}
                        </Text>
                      </View>
                      {podcast.releaseDate && (
                        <Text className="text-xs text-gray-500">
                          {new Date(podcast.releaseDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {/* No Results mtg */}
              {podcasts.length === 0 && (
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
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
