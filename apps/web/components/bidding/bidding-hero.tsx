import { cn } from "@packtok/ui/lib/utils";
import Image from "next/image";

export function BiddingHero() {
  return (
    <section
      className={cn(
        // Layout & box model
        "relative w-full min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden",

        // Typography
        "text-white",

        // Colors & background - Updated gradient to match Figma
        "bg-gradient-to-br from-[#e855d1] via-[#8b5cf6] to-[#6366f1]",

        // Visual effects
        "before:absolute before:inset-0 before:bg-black/5"
      )}
    >
      {/* Background decorative 3D blob */}
      <div className="absolute top-1/2 right-4 md:right-8 lg:right-12 -translate-y-1/2">
        <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
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
              "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-white/20 flex items-center justify-center relative",

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
                // Typography - Made more responsive
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase font-black leading-[0.85] tracking-tight",

                // Colors
                "text-white drop-shadow-lg"
              )}
            >
              Auction <span className="block">by</span>
            </h1>
            <h1
              className={cn(
                // Typography - Made more responsive
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.85] tracking-tight",

                // Colors
                "text-white drop-shadow-lg"
              )}
            >
              Packtok
            </h1>

            <p className="pt-4 text-sm sm:text-base md:text-lg max-w-xl text-white/90">
              Auction of complete project including machinery, raw materials,
              finish goods and other assets. Ideal opportunity for businesses
              looking to expand or enter new markets with established
              operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
