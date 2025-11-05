// components/bidding/CountdownTimer.tsx
import { Auction } from "@/types/auction";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface TimeParts {
  totalMs: number;
  hours: string;
  minutes: string;
  seconds: string;
}

const formatNumber = (value: number) => value.toString().padStart(2, "0");

const computeTimeParts = (target: string | null | undefined): TimeParts => {
  if (!target) {
    return { totalMs: 0, hours: "00", minutes: "00", seconds: "00" };
  }
  const targetDate = new Date(target);
  if (Number.isNaN(targetDate.getTime())) {
    return { totalMs: 0, hours: "00", minutes: "00", seconds: "00" };
  }
  const diff = Math.max(targetDate.getTime() - Date.now(), 0);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return {
    totalMs: diff,
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds),
  };
};

interface CountdownTimerProps {
  nextAuction: Auction | null;
}

export function CountdownTimer({ nextAuction }: CountdownTimerProps) {
  const targetKey =
    nextAuction?.status === "LIVE"
      ? nextAuction.endAt
      : nextAuction?.startAt || null;

  const [timeLeft, setTimeLeft] = useState<TimeParts>(() =>
    computeTimeParts(targetKey)
  );

  useEffect(() => {
    setTimeLeft(computeTimeParts(targetKey));

    if (!targetKey) {
      return undefined;
    }

    const interval = setInterval(() => {
      setTimeLeft(computeTimeParts(targetKey));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [targetKey]);

  const headline =
    nextAuction?.status === "LIVE"
      ? "Current Auction Ends In"
      : "Next Auction Starts In";

  if (!nextAuction) {
    return (
      <View className="py-8 px-4">
        <Text className="text-center text-gray-500 text-base">
          No auctions scheduled
        </Text>
      </View>
    );
  }

  return (
    <View className="py-6 px-4">
      {/* Headline */}
      <Text className="text-center text-gray-700 text-sm font-semibold uppercase tracking-wide mb-4">
        {headline}
      </Text>

      {/* Countdown Display */}
      <View className="flex-row justify-center items-center space-x-3">
        {/* Hours */}
        <View className="items-center">
          <View className="bg-black rounded-xl px-4 py-3 min-w-[70px]">
            <Text className="text-white text-3xl font-bold text-center">
              {timeLeft.hours}
            </Text>
          </View>
          <Text className="text-gray-600 text-xs mt-2 uppercase tracking-wide">
            Hours
          </Text>
        </View>

        <Text className="text-gray-400 text-2xl font-bold pb-6">:</Text>

        {/* Minutes */}
        <View className="items-center">
          <View className="bg-black rounded-xl px-4 py-3 min-w-[70px]">
            <Text className="text-white text-3xl font-bold text-center">
              {timeLeft.minutes}
            </Text>
          </View>
          <Text className="text-gray-600 text-xs mt-2 uppercase tracking-wide">
            Minutes
          </Text>
        </View>

        <Text className="text-gray-400 text-2xl font-bold pb-6">:</Text>

        {/* Seconds */}
        <View className="items-center">
          <View className="bg-black rounded-xl px-4 py-3 min-w-[70px]">
            <Text className="text-white text-3xl font-bold text-center">
              {timeLeft.seconds}
            </Text>
          </View>
          <Text className="text-gray-600 text-xs mt-2 uppercase tracking-wide">
            Seconds
          </Text>
        </View>
      </View>
    </View>
  );
}
