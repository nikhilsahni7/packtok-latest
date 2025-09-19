import { Button } from "@packtok/ui/components/button";
import Image from "next/image";

export default function Newsletter() {
  return (
    <div className="relative w-full mx-auto py-8 sm:py-12 md:py-16 bg-gradient-to-r from-gray-50 to-white overflow-visible">
      {/* Center content */}
      <div className="relative bg-newsletter z-10 flex flex-col items-center max-w-sm sm:max-w-md mx-auto text-center px-4">
        <div className="w-[540px]">
          <h1 className="text-lg sm:text-xl md:text-3xl lg:text-[40px] font-medium text-gray-900 mb-2 sm:mb-3 tracking-wide">
            Join Our Newsletter
          </h1>
          <h4 className="text-sm md:text-[18px] text-gray-600 mb-6 sm:mb-8 font-regular">
            Sign up for deals, new products and promotions
          </h4>
        </div>
        <form className="w-full sm:w-[90%]">
          <div className="flex items-center border-b-1 border-[#6C727580] focus-within:border-gray-900 transition-colors duration-300 px-2 sm:px-4">
            <input
              type="email"
              placeholder="Email address"
              required
              className="flex-1 py-3 sm:py-4 px-0 t bg-transparent border-none outline-none placeholder-gray-400 text-black"
            />
            <Button
              type="submit"
              className="ml-2 sm:ml-4 px-3 sm:px-4 md:px-6 py-2 bg-gray-900 text-white text-xs sm:text-sm font-medium  uppercase hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-none"
            >
              Signup
            </Button>
          </div>
        </form>
      </div>

      {/* Left image absolute */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 overflow-visible hidden xl:block">
        <Image
          src="/news-right.png"
          alt="Newsletter Left Image"
          className="object-contain"
          width={350}
          height={280}
          priority
        />
      </div>

      {/* Right image absolute */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 overflow-visible hidden xl:block">
        <Image
          src="/news-left.png"
          alt="Newsletter Right Image"
          className="object-contain"
          width={350}
          height={350}
          priority
        />
      </div>
    </div>
  );
}
