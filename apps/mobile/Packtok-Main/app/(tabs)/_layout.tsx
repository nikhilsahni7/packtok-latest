import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

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
          tabBarIcon: ({ color, focused }) => (
            <Feather name="shopping-cart" size={26} color={color} />
          ),
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
