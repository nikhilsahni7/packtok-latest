import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");

// Mock podcast data - will be replaced with API data later
const MOCK_PODCASTS = [
  {
    id: "1",
    title: "The Future of Packaging Technology",
    description:
      "Exploring innovations in sustainable packaging and automation. In this comprehensive discussion, we dive deep into the latest trends shaping the packaging industry, from biodegradable materials to smart packaging solutions that enhance product safety and consumer experience.",
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
    description:
      "Best practices in modern manufacturing and quality control. Learn from industry experts about implementing quality management systems, optimizing production processes, and achieving excellence in manufacturing operations.",
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
      "Expert tips on maintaining industrial machinery for optimal performance. This episode covers preventive maintenance strategies, common issues, and solutions to extend the lifespan of your equipment.",
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
    description:
      "How eco-friendly packaging is reshaping the industry. Discover innovative approaches to reduce environmental impact while maintaining product integrity and meeting consumer expectations.",
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
    description:
      "Leveraging AI and IoT for smarter production. Explore how cutting-edge technologies are revolutionizing manufacturing processes, improving efficiency, and creating new opportunities for growth.",
    videoId: "QoAoefT3VJc",
    thumbnail: `https://img.youtube.com/vi/QoAoefT3VJc/maxresdefault.jpg`,
    duration: "50:12",
    likes: 567,
    comments: 78,
    tags: ["Digital", "AI", "IoT", "Manufacturing"],
    publishedAt: "2024-03-01",
  },
];

// Mock comments - will be replaced with API data later
const MOCK_COMMENTS = [
  {
    id: "1",
    user: "John Smith",
    avatar:
      "https://ui-avatars.com/api/?name=John+Smith&background=FF8C42&color=fff",
    comment: "Great insights! This really helped me understand the new trends.",
    timestamp: "2 days ago",
    likes: 12,
  },
  {
    id: "2",
    user: "Sarah Johnson",
    avatar:
      "https://ui-avatars.com/api/?name=Sarah+Johnson&background=4169E1&color=fff",
    comment: "Would love to see more content like this. Very informative!",
    timestamp: "5 days ago",
    likes: 8,
  },
  {
    id: "3",
    user: "Michael Chen",
    avatar:
      "https://ui-avatars.com/api/?name=Michael+Chen&background=32CD32&color=fff",
    comment: "The section about sustainability was particularly interesting.",
    timestamp: "1 week ago",
    likes: 15,
  },
];

export default function PodcastDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  // Find the podcast by ID
  const podcast = MOCK_PODCASTS.find((p) => p.id === id);

  React.useEffect(() => {
    if (podcast) {
      setLocalLikes(podcast.likes);
    }
  }, [podcast]);

  if (!podcast) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Podcast not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-orange-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleLike = () => {
    if (isLiked) {
      setLocalLikes((prev) => prev - 1);
    } else {
      setLocalLikes((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${podcast.videoId}`;
    Linking.openURL(youtubeUrl);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // TODO: Add comment via API
      console.log("Adding comment:", newComment);
      setNewComment("");
    }
  };

  const displayedComments = showAllComments
    ? MOCK_COMMENTS
    : MOCK_COMMENTS.slice(0, 3);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Video Player */}
        <View className="relative" style={{ height: width * 0.56 }}>
          <WebView
            source={{
              uri: `https://www.youtube.com/embed/${podcast.videoId}?rel=0&modestbranding=1`,
            }}
            style={{ flex: 1 }}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
          />

          {/* Back Button Overlay */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-5 w-10 h-10 items-center justify-center bg-black/60 rounded-full"
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View className="px-5 pt-4">
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-3">
            {podcast.title}
          </Text>

          {/* Stats Row */}
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <Feather name="clock" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">
                {podcast.duration}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="calendar" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">
                {new Date(podcast.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="eye" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">1.2k views</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center justify-around mb-6 pb-6 border-b border-gray-200">
            {/* Like Button */}
            <TouchableOpacity
              onPress={handleLike}
              className="items-center"
              activeOpacity={0.7}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  isLiked ? "bg-red-100" : "bg-gray-100"
                }`}
              >
                <Feather
                  name={isLiked ? "heart" : "heart"}
                  size={24}
                  color={isLiked ? "#EF4444" : "#6B7280"}
                  fill={isLiked ? "#EF4444" : "none"}
                />
              </View>
              <Text className="text-sm text-gray-600 mt-2">{localLikes}</Text>
            </TouchableOpacity>

            {/* Comment Button */}
            <TouchableOpacity className="items-center" activeOpacity={0.7}>
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                <Feather name="message-circle" size={24} color="#6B7280" />
              </View>
              <Text className="text-sm text-gray-600 mt-2">
                {podcast.comments}
              </Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity
              onPress={handleShare}
              className="items-center"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                <Feather name="share-2" size={24} color="#6B7280" />
              </View>
              <Text className="text-sm text-gray-600 mt-2">Share</Text>
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity className="items-center" activeOpacity={0.7}>
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                <Feather name="bookmark" size={24} color="#6B7280" />
              </View>
              <Text className="text-sm text-gray-600 mt-2">Save</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Description
            </Text>
            <Text className="text-base text-gray-700 leading-6">
              {podcast.description}
            </Text>
          </View>

          {/* Tags */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">Tags</Text>
            <View className="flex-row flex-wrap">
              {podcast.tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-orange-100 rounded-full px-4 py-2 mr-2 mb-2"
                  activeOpacity={0.7}
                >
                  <Text className="text-sm text-orange-700 font-medium">
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Comments Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Comments ({podcast.comments})
            </Text>

            {/* Add Comment */}
            <View className="flex-row items-center mb-6 bg-gray-50 rounded-2xl p-3">
              <Image
                source={{
                  uri: "https://ui-avatars.com/api/?name=You&background=FF8C42&color=fff",
                }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <TextInput
                placeholder="Add a comment..."
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-base text-gray-900"
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              {newComment.trim().length > 0 && (
                <TouchableOpacity
                  onPress={handleAddComment}
                  className="ml-2 bg-orange-500 rounded-full px-4 py-2"
                  activeOpacity={0.7}
                >
                  <Text className="text-white font-semibold text-sm">Post</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Comments List */}
            {displayedComments.map((comment) => (
              <View
                key={comment.id}
                className="mb-4 pb-4 border-b border-gray-100"
              >
                <View className="flex-row">
                  <Image
                    source={{ uri: comment.avatar }}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-sm font-semibold text-gray-900">
                        {comment.user}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {comment.timestamp}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-700 leading-5 mb-2">
                      {comment.comment}
                    </Text>
                    <View className="flex-row items-center">
                      <TouchableOpacity className="flex-row items-center mr-4">
                        <Feather name="heart" size={14} color="#6B7280" />
                        <Text className="text-xs text-gray-600 ml-1">
                          {comment.likes}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text className="text-xs text-gray-600 font-medium">
                          Reply
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* Show More Comments Button */}
            {MOCK_COMMENTS.length > 3 && (
              <TouchableOpacity
                onPress={() => setShowAllComments(!showAllComments)}
                className="items-center py-3"
                activeOpacity={0.7}
              >
                <Text className="text-sm text-orange-600 font-semibold">
                  {showAllComments
                    ? "Show Less"
                    : `View ${MOCK_COMMENTS.length - 3} More Comments`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Related Podcasts */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Related Podcasts
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/podcasts" as any)}
                activeOpacity={0.7}
              >
                <Text className="text-sm text-orange-600 font-semibold">
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {MOCK_PODCASTS.filter((p) => p.id !== id)
                .slice(0, 3)
                .map((relatedPodcast) => (
                  <TouchableOpacity
                    key={relatedPodcast.id}
                    className="mr-4 w-64"
                    onPress={() =>
                      router.push(`/podcasts/${relatedPodcast.id}` as any)
                    }
                    activeOpacity={0.7}
                  >
                    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <Image
                        source={{ uri: relatedPodcast.thumbnail }}
                        style={{ width: "100%", height: 140 }}
                        resizeMode="cover"
                      />
                      <View className="p-3">
                        <Text
                          className="text-sm font-bold text-gray-900 mb-1"
                          numberOfLines={2}
                        >
                          {relatedPodcast.title}
                        </Text>
                        <Text
                          className="text-xs text-gray-600"
                          numberOfLines={1}
                        >
                          {relatedPodcast.duration} • {relatedPodcast.likes}{" "}
                          likes
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
