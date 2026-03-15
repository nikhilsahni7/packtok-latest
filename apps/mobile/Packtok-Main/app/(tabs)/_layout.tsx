import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { useCartItemCount } from "@/hooks/useCart";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF8C42", // Orange color matching design
        tabBarInactiveTintColor: "#9CA3AF", // Gray color
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6", // Lighter border
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 15,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 6,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="home" size={26} color={color} />
          ),
        }}
      />

      {/* Wishlist Tab */}
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="heart" size={26} color={color} />
          ),
        }}
      />

      {/* Cart Tab */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => {
            const itemCount = useCartItemCount();
            return (
              <View>
                <Feather name="shopping-cart" size={26} color={color} />
                {itemCount > 0 && (
                  <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                    <Text className="text-white text-[10px] font-bold">
                      {itemCount > 99 ? "99+" : itemCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Setting",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="settings" size={26} color={color} />
          ),
        }}
      />

      {/* Marketplace - Hidden from tab bar but accessible */}
      <Tabs.Screen
        name="marketplace"
        options={{
          href: null, // This removes it from the tab bar
        }}
      />

      {/* Categories - Hidden from tab bar but accessible */}
      <Tabs.Screen
        name="categories"
        options={{
          href: null, // This removes it from the tab bar
        }}
      />
    </Tabs>
  );
}
