// components/bidding/MachineCard.tsx
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface MachineCardProps {
  machineName?: string;
  startingPrice?: string;
  imageUrl?: string;
  onPress?: () => void;
  statusLabel?: string;
  meta?: string;
  ctaLabel?: string;
  disabled?: boolean;
  priceLabel?: string;
  style?: ViewStyle;
}

export function MachineCard({
  machineName = "Machine Name",
  startingPrice = "₹2,00,000",
  imageUrl,
  onPress,
  statusLabel,
  meta,
  ctaLabel = "View auction",
  disabled = false,
  priceLabel = "Starting price",
  style,
}: MachineCardProps) {
  return (
    <View
      className="w-[320px] bg-[#F0F0F0] rounded-2xl overflow-hidden shadow-lg border border-gray-100 mr-4"
      style={style}
    >
      {/* Machine Image */}
      <View className="relative w-full h-56 bg-gray-100">
        {statusLabel && (
          <View className="absolute top-4 left-4 rounded-full bg-black/70 px-3 py-1.5 z-10">
            <Text className="text-white text-xs font-semibold uppercase tracking-wide">
              {statusLabel}
            </Text>
          </View>
        )}

        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <View className="w-16 h-16 bg-gray-300 rounded-lg items-center justify-center mb-4">
              <Feather name="package" size={32} color="#9CA3AF" />
            </View>
          </View>
        )}

        {/* Machine Name Badge */}
        <View className="absolute bottom-4 left-4 px-4 py-2 rounded-lg bg-gray-600/80">
          <Text className="text-sm font-semibold text-white">
            {machineName}
          </Text>
        </View>
      </View>

      {/* Card Content */}
      <View className="p-5 space-y-6 w-full">
        {/* Starting Price */}
        <View className="flex-row  items-center justify-between space-y-2">
          <View>

            <Text className="text-sm text-black font-semibold uppercase tracking-wide">
              {priceLabel}
            </Text>
            <Text className="text-[14px] font-medium  text-black">
              {startingPrice}
            </Text>
            {meta && <Text className="text-[10px] mt-2 text-black">{meta}</Text>}

          </View>

          {/* Call to action */}
          <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={` h-12 px-6 rounded-full items-center justify-center  ${disabled ? "bg-gray-400" : "bg-black active:bg-gray-800"
              }`}
            activeOpacity={0.7}
          >
            <Text className="text-white text-[12px] font-semibold">{ctaLabel}</Text>
          </TouchableOpacity>
        </View>


      </View>
    </View>
  );
}
