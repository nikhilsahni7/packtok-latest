import { cn } from "@packtok/ui/lib/utils";
import Image from "next/image";

export function BiddingHero() {
  return (
    <section
      className={cn(
        // Layout & box model
        "relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden",

        // Typography
        "text-white",

        // Colors & background - Updated gradient to match Figma
        "bg-gradient-to-br from-[#e855d1] via-[#8b5cf6] to-[#6366f1]",

        // Visual effects
        "before:absolute before:inset-0 before:bg-black/5"
      )}
    >
      {/* Background decorative 3D blob */}
      <div className="absolute top-1/2 right-8 lg:right-16 -translate-y-1/2">
        <div className="relative w-80 h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem]">
          <Image
            src="/bidding-header.png"
            alt="3D Abstract Blob Shape"
            fill
            className="object-contain opacity-95 drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Content Container */}
      <div
        className={cn(
          // Layout & box model
          "relative z-10 container mx-auto px-4 lg:px-8",

          // Positioning
          "flex flex-col items-start justify-center h-full"
        )}
      >
        {/* Left side content */}
        <div className="max-w-2xl space-y-8">
          {/* Brand circle with scroll animation hint */}
          <div
            className={cn(
              // Layout & box model
              "w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center relative",

              // Typography
              "text-xs font-light tracking-wider",

              // Colors
              "bg-white/5 backdrop-blur-md",

              // Animation
              "animate-pulse"
            )}
          >
            {/* Circular text effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-20 h-20 animate-spin"
                style={{ animationDuration: "20s" }}
              >
                <path
                  id="circle"
                  d="M 40, 40 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                  fill="none"
                  className="opacity-60"
                />
                <text className="text-[8px] fill-white/80 font-light tracking-[2px]">
                  <textPath href="#circle">
                    scroll down • scroll down •
                  </textPath>
                </text>
              </svg>
            </div>
            {/* Center arrow */}
            <div className="text-white/90">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 16.5l-6-6h12z" />
              </svg>
            </div>
          </div>

          {/* Main heading */}
          <div className="space-y-2">
            <h1
              className={cn(
                // Typography - Made larger and bolder to match Figma
                "text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.85] tracking-tight",

                // Colors
                "text-white drop-shadow-lg"
              )}
            >
              MACHINES
            </h1>
            <h1
              className={cn(
                // Typography
                "text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.85] tracking-tight",

                // Colors
                "text-white drop-shadow-lg"
              )}
            >
              AUCTIONS
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
