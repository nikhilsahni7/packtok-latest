"use client";

import Image from "next/image";
import Link from "next/link";

export default function AuthChoicePage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image with orange bubbles */}
      <div className="hidden bg-gray-100 lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="signup before:w-[10%] before:h-full before:z-[3] before:left-0 before:top-0 before:absolute after:w-[10%] after:h-full after:z-[2] after:left-0 after:top-0 after:absolute">
          <Image
            src="/signin-user.png"
            alt="Packtok"
            className="object-contain"
            width={600}
            height={600}
            priority
          />
        </div>
      </div>

      {/* Right side - Choice buttons */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md text-center space-y-10">
          {/* Branding */}
          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold tracking-tight">
              <span className="text-black">Pack</span>
              <span className="text-orange-500">tok</span>
              <span className="text-orange-500 text-sm align-super">&#174;</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg">
              Complete Packaging Solution
            </p>
          </div>

          {/* Choice buttons */}
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="block w-full py-3.5 px-6 rounded-lg border-2 border-gray-200 text-gray-800 font-semibold text-base hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
            >
              Sign In as User
            </Link>
            <Link
              href="/auth/vendor/signin"
              className="block w-full py-3.5 px-6 rounded-lg border-2 border-gray-200 text-gray-800 font-semibold text-base hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
            >
              Sign In as Vendor
            </Link>
            <Link
              href="/auth/register"
              className="block w-full py-3.5 px-6 rounded-lg bg-gray-900 text-white font-semibold text-base hover:bg-gray-800 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
