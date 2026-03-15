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
  ActivityIndicator,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  usePodcast,
  usePodcastComments,
  useReactToPodcast,
  useAddPodcastComment,
  usePodcasts,
} from "@/hooks/usePodcasts";

const { width } = Dimensions.get("window");

export default function PodcastDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const { data: podcast, isLoading, isError } = usePodcast(id);
  const { data: commentsData } = usePodcastComments(id);
  const comments = commentsData?.items ?? [];

  const { data: relatedPodcastsData } = usePodcasts({ limit: 5 });
  const relatedPodcasts =
    relatedPodcastsData?.items?.filter((p) => p.id !== id) ?? [];

  const { mutate: reactToPodcast } = useReactToPodcast(id);
  const { mutate: addComment, isPending: isAddingComment } =
    useAddPodcastComment(id);

  // Video Player - We assume the backend returns a direct video URL (e.g. from S3).
  // Native expo-video handles playback seamlessly.
  const videoSource = podcast?.videoUrl ? podcast.videoUrl : "";
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    // player.play(); // Auto-play can be enabled or disabled
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#FF8C42" />
        <Text className="text-gray-500 mt-4">Loading podcast...</Text>
      </View>
    );
  }

  if (isError || !podcast) {
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

  const isLiked = podcast.userReaction === "LIKE";

  const handleLike = () => {
    // If it is already liked, acting on 'LIKE' again will toggle (remove) the reaction.
    // If it's not liked, it will set the reaction to 'LIKE'.
    reactToPodcast("LIKE");
  };

  const handleShare = () => {
    // Sharing just the Packtok backend web url or something similar
    // We will just do a standard fallback to the packtok domain
    Linking.openURL(`https://packtok.com/podcasts/${id}`);
  };

  const handleAddComment = () => {
    if (newComment.trim() && !isAddingComment) {
      addComment(
        { content: newComment.trim() },
        {
          onSuccess: () => {
             setNewComment("");
          }
        }
      );
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Video Player */}
        <View className="relative bg-black" style={{ height: width * 0.56 }}>
          {podcast.videoUrl ? (
            <VideoView
              style={{ flex: 1 }}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          ) : (
             <View className="flex-1 items-center justify-center">
                <Text className="text-white">Video not available</Text>
             </View>
          )}

          {/* Back Button Overlay */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-5 w-10 h-10 items-center justify-center bg-black/60 rounded-full z-10"
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
                 {podcast.duration ? `${Math.floor(podcast.duration / 60)}:${String(podcast.duration % 60).padStart(2, '0')}` : '--:--'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="calendar" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">
                {podcast.releaseDate
                  ? new Date(podcast.releaseDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Unknown date"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="eye" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-2">
                {podcast.viewCount} views
              </Text>
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
                  name="heart"
                  size={24}
                  color={isLiked ? "#EF4444" : "#6B7280"}
                  fill={isLiked ? "#EF4444" : "none"}
                />
              </View>
              <Text className="text-sm text-gray-600 mt-2">
                {podcast.likeCount}
              </Text>
            </TouchableOpacity>

            {/* Comment Button */}
            <TouchableOpacity className="items-center" activeOpacity={0.7}>
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                <Feather name="message-circle" size={24} color="#6B7280" />
              </View>
              <Text className="text-sm text-gray-600 mt-2">
                {podcast.commentCount}
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
          {podcast.tags && podcast.tags.length > 0 && (
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
          )}

          {/* Comments Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Comments ({podcast.commentCount})
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
                editable={!isAddingComment}
              />
              {newComment.trim().length > 0 && (
                <TouchableOpacity
                  onPress={handleAddComment}
                  disabled={isAddingComment}
                  className={`ml-2 rounded-full px-4 py-2 ${isAddingComment ? "bg-orange-300" : "bg-orange-500"}`}
                  activeOpacity={0.7}
                >
                  {isAddingComment ? (
                     <ActivityIndicator size="small" color="#fff" />
                  ) : (
                     <Text className="text-white font-semibold text-sm">Post</Text>
                  )}
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
                    source={{
                       uri: comment.user.profile_image ??
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            comment.user.name
                          )}&background=random&color=fff`
                    }}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-sm font-semibold text-gray-900">
                        {comment.user.name}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-700 leading-5 mb-2">
                      {comment.content}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Show More Comments Button */}
            {comments.length > 3 && (
              <TouchableOpacity
                onPress={() => setShowAllComments(!showAllComments)}
                className="items-center py-3"
                activeOpacity={0.7}
              >
                <Text className="text-sm text-orange-600 font-semibold">
                  {showAllComments
                    ? "Show Less"
                    : `View ${comments.length - 3} More Comments`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Related Podcasts */}
          {relatedPodcasts.length > 0 && (
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
                {relatedPodcasts.map((relatedPodcast) => (
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
                        source={relatedPodcast.thumbnailUrl ? { uri: relatedPodcast.thumbnailUrl } : require("@/assets/images/article1.png")}
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
                          {relatedPodcast.duration ? `${Math.floor(relatedPodcast.duration / 60)}:${String(relatedPodcast.duration % 60).padStart(2, '0')}` : '--:--'} • {relatedPodcast.likeCount} likes
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
