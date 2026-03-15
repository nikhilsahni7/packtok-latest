import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useArticles } from "@/hooks/useArticles";
import PageHeader from "@/components/PageHeader";

export default function ArticlesScreen() {
  const router = useRouter();
  const { data: articles = [], isLoading } = useArticles();
  const hasArticles = articles.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white relative" edges={["top"]}>
      <StatusBar style="dark" />

      {/* Unified Header */}
      <PageHeader showSearch={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1 relative z-10"
      >
        <View className="px-5 pt-2 pb-6">
          <View className="mb-6">
            <Text className="text-[28px] font-bold tracking-tight text-gray-900 mb-1">
              Packaging Articles
            </Text>
            <Text className="text-sm text-gray-600">
              Insights, guides, and updates from the packaging industry.
            </Text>
          </View>

          {isLoading && (
            <Text className="text-base text-gray-500 mt-4">Loading articles...</Text>
          )}

          {!isLoading && !hasArticles && (
            <View className="rounded-2xl border border-gray-200 bg-white p-8 items-center">
              <Text className="text-gray-600">No articles are live yet.</Text>
            </View>
          )}

          {!isLoading && hasArticles && (
            <View className="flex-col gap-5">
              {articles.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                  activeOpacity={0.8}
                  onPress={() => router.push(`/articles/${article.id}` as any)}
                >
                  {/* Article Cover Image */}
                  <View className="w-full">
                    <Image
                      source={
                        article.coverImage
                          ? { uri: article.coverImage }
                          : require("@/assets/images/article1.png")
                      }
                      className="w-full"
                      style={{ height: 180 }}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Article Content */}
                  <View className="p-4">
                    <View className="flex-row items-center mb-2">
                      <Feather name="calendar" size={12} color="#6B7280" />
                      <Text className="text-xs text-gray-500 ml-1.5 font-medium">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    
                    <Text className="text-lg font-bold leading-snug text-gray-900 mb-2" numberOfLines={2}>
                      {article.title}
                    </Text>
                    
                    <Text className="text-sm text-gray-600 mb-4 leading-relaxed" numberOfLines={3}>
                      {article.content}
                    </Text>
                    
                    <View className="flex-row items-center border-b border-gray-900 pb-0.5 self-start">
                      <Text className="text-sm font-semibold text-gray-900">Read More</Text>
                      <Feather name="arrow-right" size={14} color="black" className="ml-1" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
