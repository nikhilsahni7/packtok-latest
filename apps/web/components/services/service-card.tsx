import { Button } from "@packtok/ui/components/button";
import Image, { StaticImageData } from "next/image";

type ServiceCardProps = {
title: string;
  subtitle: string;
  description: string;
  image: StaticImageData | string;
  imagePosition?: "left" | "right";
  backgroundColor?: "white" | "black";
};

export default function ServiceCard({
  title,
  subtitle,
  description,
  image,
  imagePosition = "left",
  backgroundColor = "white",
}: ServiceCardProps) {
  const isImageLeft = imagePosition === "left";
  const isDark = backgroundColor === "black";

  return (
    <div className="relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {!isDark && (
          <>
            {/* Large orange circles - positioned based on image side */}
            {isImageLeft ? (
              <>
                <div className="absolute top-16 -right-40 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-orange-500/20 rounded-full"></div>
                <div className="absolute -bottom-20 right-20 w-60 h-60 bg-orange-300/15 rounded-full"></div>
              </>
            ) : (
              <>
                <div className="absolute top-16 -left-40 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-orange-500/20 rounded-full"></div>
                <div className="absolute -bottom-20 left-20 w-60 h-60 bg-orange-300/15 rounded-full"></div>
              </>
            )}
          </>
        )}
        {isDark && (
          <>
            {/* Orange circles for dark theme (Turnkey projects) */}
            <div className="absolute top-0 -right-48 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/25 to-orange-600/25 rounded-full"></div>
            <div className="absolute -bottom-32 right-32 w-80 h-80 bg-orange-400/20 rounded-full"></div>
            {/* Small decorative elements */}
            <div className="absolute bottom-32 left-16 w-8 h-8 opacity-30">
              <div className="w-full h-full bg-orange-400 rounded-full"></div>
            </div>
          </>
        )}
      </div>

      <div
        className={`flex flex-col lg:flex-row ${!isImageLeft ? "lg:flex-row-reverse" : ""} min-h-[650px] ${isDark ? "bg-black text-white" : "bg-white"}`}
      >
        {/* Image section */}
        <div className="w-full lg:w-1/2 relative overflow-hidden">
          <Image
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            width={800}
            height={650}
            priority
          />
        </div>

        {/* Content section */}
        <div className="w-full lg:w-1/2 px-8 py-16 lg:px-16 lg:py-20 xl:px-24 xl:py-24 flex flex-col justify-center relative z-10">
          <h2
            className={`text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {title}
          </h2>
          <p
            className={`text-xl lg:text-2xl mb-8 font-normal leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            {subtitle}
          </p>
          <p
            className={`mb-12 leading-relaxed text-base lg:text-lg max-w-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {description}
          </p>
          <Button
            className={`${
              isDark
                ? "bg-white text-black hover:bg-gray-100 border-2 border-white"
                : "bg-gray-900 text-white hover:bg-black border-2 border-gray-900"
            } w-fit px-8 py-3 text-base font-semibold rounded-sm transition-all duration-300 hover:shadow-lg uppercase tracking-wide`}
            size="lg"
          >
            Request
          </Button>
        </div>
      </div>
    </div>
  );
}
