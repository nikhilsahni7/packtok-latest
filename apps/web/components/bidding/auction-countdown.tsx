"use client";

import { Auction } from "@/types/auction";
import { cn } from "@packtok/ui/lib/utils";
import { useEffect, useMemo, useState } from "react";

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

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
};

interface AuctionCountdownProps {
  nextAuction: Auction | null;
}

export function AuctionCountdown({ nextAuction }: AuctionCountdownProps) {
  const targetKey = useMemo(() => {
    if (!nextAuction) {
      return null;
    }
    return nextAuction.status === "LIVE"
      ? nextAuction.endAt
      : nextAuction.startAt;
  }, [nextAuction]);

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

  const headline = useMemo(() => {
    if (!nextAuction) {
      return "No auctions scheduled";
    }
    if (nextAuction.status === "LIVE") {
      return `${nextAuction.product?.title ?? "Live auction"} is live`;
    }
    return `${nextAuction.product?.title ?? "Next auction"} begins soon`;
  }, [nextAuction]);

  const description = useMemo(() => {
    if (!nextAuction) {
      return "We are preparing the next round of auctions. Check back later or subscribe for updates.";
    }
    if (nextAuction.status === "LIVE") {
      return `Bidding closes on ${formatDateTime(nextAuction.endAt)}.`;
    }
    return `Bidding opens on ${formatDateTime(nextAuction.startAt)}.`;
  }, [nextAuction]);

  return (
    <section
      className={cn("w-full py-16 lg:py-20 bg-gray-50", "text-center relative")}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-left pb-5">
          <strong className="text-[2rem]">Auction Notice:</strong>
          <p className="mt-2 text-gray-600 text-base lg:text-lg">
            Stay ahead of upcoming sales and never miss an opportunity to bid on
            premium industrial assets. Enroll early to secure your slot and
            receive instant notifications when bidding opens.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:flex-1 mb-12 lg:mb-0 text-left">
            <h2
              className={cn(
                "text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4",
                "text-gray-900"
              )}
            >
              {headline}
            </h2>

            <p
              className={cn(
                "text-lg lg:text-xl text-gray-600 font-medium",
                "max-w-xl"
              )}
            >
              {description}
            </p>
          </div>

          <div className="lg:flex-1 lg:text-right">
            {targetKey ? (
              <div
                className={cn(
                  "flex items-end justify-center lg:justify-end gap-4 lg:gap-6 xl:gap-8"
                )}
              >
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "tabular-nums",
                      "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none",
                      "text-gray-900"
                    )}
                  >
                    {timeLeft.hours}
                  </span>
                  <span className="mt-2 text-sm lg:text-base font-semibold uppercase tracking-wider text-gray-500">
                    Hours
                  </span>
                </div>

                <span className="hidden sm:block mx-1 text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none text-gray-200">
                  /
                </span>

                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "tabular-nums",
                      "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none",
                      "text-gray-900"
                    )}
                  >
                    {timeLeft.minutes}
                  </span>
                  <span className="mt-2 text-sm lg:text-base font-semibold uppercase tracking-wider text-gray-500">
                    Minutes
                  </span>
                </div>

                <span className="hidden sm:block mx-1 text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none text-gray-200">
                  /
                </span>

                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "tabular-nums",
                      "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none",
                      "text-gray-900"
                    )}
                  >
                    {timeLeft.seconds}
                  </span>
                  <span className="mt-2 text-sm lg:text-base font-semibold uppercase tracking-wider text-gray-500">
                    Seconds
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Countdown will appear once the next auction is scheduled.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
