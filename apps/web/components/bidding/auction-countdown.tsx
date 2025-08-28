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
            {/* Countdown Numbers + Labels, grouped for alignment */}
            <div
              className={cn(
                // Layout & box model
                "flex items-end justify-center lg:justify-end gap-4 lg:gap-6 xl:gap-8"
              )}
            >
              {/* Hours */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "tabular-nums",
                    // Typography
                    "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none",
                    // Colors
                    "text-gray-300"
                  )}
                >
                  {formatNumber(timeLeft.hours)}
                </span>
                <span
                  className={cn(
                    // Typography
                    "mt-2 text-sm lg:text-base font-semibold uppercase tracking-wider",
                    // Colors
                    "text-gray-500"
                  )}
                >
                  Hours
                </span>
              </div>

              {/* Separator */}
              <span
                className={cn(
                  "hidden sm:block mx-1",
                  "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none",
                  "text-gray-200"
                )}
              >
                /
              </span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "tabular-nums",
                    "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none",
                    "text-gray-300"
                  )}
                >
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="mt-2 text-sm lg:text-base font-semibold uppercase tracking-wider text-gray-500">
                  Minutes
                </span>
              </div>

              {/* Separator */}
              <span
                className={cn(
                  "hidden sm:block mx-1",
                  "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none",
                  "text-gray-200"
                )}
              >
                /
              </span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "tabular-nums",
                    "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none",
                    "text-gray-300"
                  )}
                >
                  {formatNumber(timeLeft.seconds)}
                </span>
                <span className="mt-2 text-sm lg:text-base font-semibold uppercase tracking-wider text-gray-500">
                  Seconds
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
