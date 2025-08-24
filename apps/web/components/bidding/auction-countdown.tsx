"use client";

import { cn } from "@packtok/ui/lib/utils";
import * as React from "react";

export function AuctionCountdown() {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 80,
    minutes: 45,
    seconds: 19,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <section
      className={cn(
        // Layout & box model
        "w-full py-16 lg:py-20 bg-gray-50",

        // Typography
        "text-center relative"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main content container */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between max-w-7xl mx-auto">

          {/* Left side - Announcement */}
          <div className="lg:flex-1 mb-12 lg:mb-0 text-left lg:text-left">
          <h2
            className={cn(
              // Typography
                "text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4",

              // Colors
              "text-gray-900"
            )}
          >
            AUCTION IS COMING SOON
          </h2>

          <p
            className={cn(
              // Typography
                "text-lg lg:text-xl text-gray-600 font-medium",

              // Layout
                "max-w-lg"
              )}
            >
              Our public sale event will be held on August 17, 2025.
            </p>
          </div>

          {/* Right side - Countdown Timer */}
          <div className="lg:flex-1 lg:text-right">
            {/* Countdown Numbers */}
            <div
              className={cn(
                // Layout & box model
                "flex items-center justify-center lg:justify-end gap-1 lg:gap-2 mb-6",

                // Typography
                "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black",

                // Colors
                "text-gray-300"
            )}
          >
              <span className="tabular-nums">{formatNumber(timeLeft.hours)}</span>
              <span className="text-gray-200 mx-1">/</span>
              <span className="tabular-nums">{formatNumber(timeLeft.minutes)}</span>
              <span className="text-gray-200 mx-1">/</span>
              <span className="tabular-nums">{formatNumber(timeLeft.seconds)}</span>
            </div>

            {/* Timer Labels */}
            <div
              className={cn(
                // Layout & box model
                "flex items-center justify-center lg:justify-end gap-8 lg:gap-12 xl:gap-16",

                // Typography
                "text-sm lg:text-base font-semibold uppercase tracking-wider",

                // Colors
                "text-gray-500"
              )}
            >
              <span>Hours</span>
              <span>Minutes</span>
              <span>Seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
