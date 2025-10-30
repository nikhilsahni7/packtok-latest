import { Button } from "@packtok/ui/components/button";
import { cn } from "@packtok/ui/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

interface MachineCardProps {
  machineName?: string;
  startingPrice?: string;
  imageUrl?: string;
  onJoinAuction?: () => void;
  className?: string;
  statusLabel?: string;
  meta?: ReactNode;
  ctaLabel?: string;
  disabled?: boolean;
  priceLabel?: string;
}

export function 
MachineCard({
  machineName = "Machine Name",
  startingPrice = "$200,000",
  imageUrl,
  onJoinAuction,
  className,
  statusLabel,
  meta,
  ctaLabel = "View auction",
  disabled = false,
  priceLabel = "Starting price",
}: MachineCardProps) {
  return (
    <div
      className={cn(
        // Layout & box model
        "w-96 flex-shrink-0 bg-white rounded-xl overflow-hidden",

        // Visuals
        "shadow-lg border border-gray-100",

        // Interactions
        "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",

        className
      )}
    >
      {/* Machine Image */}
      <div className={cn("relative w-full h-64 lg:h-72", "bg-gray-100")}>
        {statusLabel ? (
          <div className="absolute top-4 left-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {statusLabel}
          </div>
        ) : null}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={machineName}
            width={300}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          // Placeholder for machine image - matches Figma design
          <div
            className={cn(
              // Layout & box model
              "w-full h-full flex items-center justify-center",

              // Typography
              "text-gray-400 text-lg font-medium",

              // Colors
              "bg-gradient-to-br from-gray-100 to-gray-200"
            )}
          >
            {/* You can add a machine icon here if needed */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Machine Name Badge */}
        <div
          className={cn(
            // Layout & positioning
            "absolute bottom-4 left-4",

            // Layout & box model
            "px-4 py-2 rounded-lg",

            // Typography
            "text-sm font-semibold text-white",

            // Colors
            "bg-gray-600/80 backdrop-blur-md"
          )}
        >
          {machineName}
        </div>
      </div>

      {/* Card Content */}
      <div
        className={cn(
          // Layout & box model
          "p-6 space-y-6"
        )}
      >
        {/* Starting Price */}
        <div className="space-y-2">
          <p
            className={cn(
              // Typography
              "text-sm text-gray-600 font-semibold uppercase tracking-wide"
            )}
          >
            {priceLabel}
          </p>
          <p
            className={cn(
              // Typography
              "text-2xl lg:text-3xl font-black text-gray-900"
            )}
          >
            {startingPrice}
          </p>
          {meta ? <div className="text-sm text-gray-600">{meta}</div> : null}
        </div>

        {/* Call to action */}
        <Button
          onClick={onJoinAuction}
          disabled={disabled}
          className={cn(
            // Layout & box model
            "w-full h-12 lg:h-14",

            // Typography
            "text-base lg:text-lg font-semibold",

            // Colors
            "bg-black text-white",

            // States
            "hover:bg-gray-800 active:bg-gray-900",

            // Visuals
            "transition-all duration-200 rounded-lg shadow-md hover:shadow-lg"
          )}
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
