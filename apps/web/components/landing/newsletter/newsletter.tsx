import { Button } from "@packtok/ui/components/button";


export default function Newsletter() {
  return (
    <div className="relative w-full newsletter-bg mx-auto pt-8 pb-16 sm:py-12 md:py-24 bg-gradient-to-r from-gray-50 to-white overflow-hidden">
      {/* Center content */}
      <div className="relative bg-newsletter z-10 flex flex-col items-center max-w-sm sm:max-w-md mx-auto text-center px-4">
        <div className="w-full max-w-[540px]">
          <h1 className="text-lg sm:text-xl md:text-3xl lg:text-[40px] font-medium text-gray-900 mb-2 sm:mb-3 tracking-wide">
            Join Our Newsletter
          </h1>
          <h4 className="text-sm md:text-[18px] text-gray-600 mb-6 sm:mb-8 font-regular">
            Sign up for deals, new products and promotions
          </h4>
        </div>
        <form className="w-full sm:w-[90%] flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full border-b-1 border-[#6C727580] focus-within:border-gray-900 transition-colors duration-300">
            <input
              type="email"
              placeholder="Email address"
              required
              className="w-full py-3 sm:py-4 px-2 sm:px-4 bg-transparent border-none outline-none placeholder-gray-400 text-black"
            />
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-md uppercase hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Signup
          </Button>
        </form>
      </div>
    </div>
  );
}
