import { useCartItemCount, useCartTotalsByCurrency } from "@/hooks/useCart";
import { Feather } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const getCurrencySymbol = (code: string) => {
  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    AED: "د.إ",
    CNY: "¥",
  };
  return symbols[code] || code;
};

export default function FloatingCartBar() {
  const router = useRouter();
  const pathname = usePathname();
  const itemCount = useCartItemCount();
  const totalsByCurrency = useCartTotalsByCurrency();
  const [isDismissed, setIsDismissed] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const prevItemCount = useRef(itemCount);

  // Excluded paths where bar shouldn't show
  const excludedPaths = ["/cart", "/(tabs)/cart"];
  const isExcluded = excludedPaths.some((p) => pathname?.includes(p));

  // Re-show when items change
  useEffect(() => {
    if (itemCount !== prevItemCount.current && itemCount > 0 && isDismissed) {
      setIsDismissed(false);
    }
    prevItemCount.current = itemCount;
  }, [itemCount, isDismissed]);

  // Animate in/out
  const shouldShow = itemCount > 0 && !isDismissed && !isExcluded;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: shouldShow ? 0 : 200, // push it further down to completely hide
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [shouldShow, slideAnim]);

  const totalText = Object.entries(totalsByCurrency)
    .map(([cur, amount]) => `${getCurrencySymbol(cur)} ${amount.toLocaleString()}`)
    .join(" • ");

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: "absolute",
        bottom: 75, // above tab bar
        left: 12,
        right: 12,
        zIndex: 50,
      }}
    >
      <View
        className="bg-emerald-600 px-4 py-3 rounded-2xl flex-row items-center justify-between"
        style={{
          shadowColor: "#059669",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {/* Left — icon + info */}
        <TouchableOpacity 
          className="flex-row items-center flex-1" 
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/cart")}
        >
          <View className="relative mr-3">
            <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
              <Feather name="shopping-bag" size={20} color="white" />
            </View>
            <View className="absolute -top-1.5 -right-1.5 bg-white w-5 h-5 rounded-full items-center justify-center">
              <Text className="text-emerald-600 text-[10px] font-bold">
                {itemCount}
              </Text>
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-sm">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Text>
            <Text className="text-emerald-100 text-xs" numberOfLines={1}>
              Total: {totalText}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Right — View Cart + Dismiss */}
        <View className="flex-row items-center">
          <TouchableOpacity 
            className="bg-white px-4 py-2 rounded-xl mr-2"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/cart")}
          >
            <Text className="text-emerald-600 font-bold text-sm">
              View Cart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsDismissed(true)}
            className="w-7 h-7 bg-white/20 rounded-lg items-center justify-center"
            activeOpacity={0.8}
          >
            <Feather name="x" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
