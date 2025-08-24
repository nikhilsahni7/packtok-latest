import Image from "next/image";
import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex mt-20">
      {/* Left side - Image */}
      <div className="hidden bg-gray-100 lg:flex lg:w-1/2 items-center justify-center p-12">
        <Image
          src="/signup-user.png"
          alt="Packtok Logo"
          className="object-contain"
          width={600}
          height={600}
        />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
