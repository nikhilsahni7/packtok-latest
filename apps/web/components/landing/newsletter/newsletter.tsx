"use client";

import { useSubscribeEmail } from "@/hooks/useEmailSubscriptions";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@packtok/ui/components/button";
import { FormEvent, useEffect, useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const currentUser = useAuthStore((s) => s.user);
  const subscribeEmail = useSubscribeEmail();

  useEffect(() => {
    if (!currentUser?.email || email) return;
    setEmail(currentUser.email);
  }, [currentUser?.email, email]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || subscribed) return;

    try {
      const result = await subscribeEmail.mutateAsync({
        email: email.trim(),
        type: "NEWSLETTER",
      });
      if (result.subscribed || result.alreadySubscribed) {
        setSubscribed(true);
      }
    } catch {
      // Handled in hook.
    }
  };

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
        <form
          onSubmit={handleSubmit}
          className="w-full sm:w-[90%] flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="flex-1 w-full border-b-1 border-[#6C727580] focus-within:border-gray-900 transition-colors duration-300">
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribed}
              className="w-full py-3 sm:py-4 px-2 sm:px-4 bg-transparent border-none outline-none placeholder-gray-400 text-black"
            />
          </div>
          <Button
            type="submit"
            disabled={subscribed || subscribeEmail.isPending}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-md uppercase hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            {subscribed
              ? "Subscribed"
              : subscribeEmail.isPending
                ? "Subscribing..."
                : "Signup"}
          </Button>
        </form>
      </div>
    </div>
  );
}
