import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useArticle } from "@/hooks/useArticles";
import PageHeader from "@/components/PageHeader";

export default function ArticleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data: article, isLoading, isError } = useArticle(id || "");

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#FAFAFA] items-center justify-center p-5">
        <Text className="text-base text-gray-500">Loading article...</Text>
      </View>
    );
  }

  if (isError || !article) {
    return (
      <View className="flex-1 bg-[#FAFAFA] items-center justify-center p-5">
        <View className="rounded-2xl border border-gray-200 bg-white p-8 items-center text-center shadow-sm w-full">
          <Text className="text-gray-700 mb-4 font-medium">Article not found.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-[#FF8C42] font-semibold text-base py-2">
              Back to articles
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white relative" edges={["top"]}>
      <StatusBar style="dark" />

      {/* Unified Header */}
      <PageHeader showSearch={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        className="flex-1 relative z-10"
      >
        <View className="px-5 pt-6 pb-8">
          {/* Article Header */}
          <View className="mb-6">
            <Text className="text-[28px] leading-[36px] font-bold tracking-normal text-gray-900 mb-4">
              {article.title}
            </Text>
            
            <View className="self-start inline-flex flex-row items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
              <Feather name="calendar" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 font-medium">
                {new Date(article.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Cover Image */}
          <View className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-50 mb-8">
            <Image
              source={
                article.coverImage
                  ? { uri: article.coverImage }
                  : require("@/assets/images/article1.png")
              }
              className="w-full aspect-[16/10]"
              resizeMode="cover"
            />
          </View>

          {/* Article Content */}
          <View className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {article.content
              .split("\n")
              .filter((line) => line.trim().length > 0)
              .map((paragraph, index) => (
                <Text 
                  key={`${index}`} 
                  className="text-base text-gray-700 leading-relaxed mb-4"
                >
                  {paragraph}
                </Text>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
