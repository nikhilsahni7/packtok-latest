import {
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";

export default function PacktokFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="h-1 bg-orange-500"></div>

      <div className="py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-6">
            {/* Logo and Contact Section */}
            <div className="flex-shrink-0">
              <div className="mb-3">
                <div className="text-6xl font-bold leading-tight">
                  <span className="text-white">Pack</span>
                  <span className="text-orange-500">tok</span>
                </div>
                <div className="text-sm text-gray-300 mt-0.5 font-normal">
                  Complete Packaging Solution
                </div>
              </div>

              <div className="flex items-center pt-2 gap-1.5">
                <Phone className="size-8 text-orange-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-300">
                    We&apos;re just a{" "}
                    <span className="text-orange-500 font-medium">
                      call away
                    </span>
                  </span>
                  <div className="text-xs mt-0.5 font-semibold text-white">
                    +91 81045-43204
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="flex gap-8">
              {/* Pages Column */}
              <div>
                <h3 className="text-white font-semibold mb-2 text-base">Pages</h3>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Marketplace
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Account Column */}
              <div>
                <h3 className="text-white font-semibold mb-2 text-base">
                  Account
                </h3>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      My Account
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      My Cart
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      My Wishlist
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Orders
                    </a>
                  </li>
                </ul>
              </div>

              {/* Information Column */}
              <div>
                <h3 className="text-white font-semibold mb-2 text-base">
                  Information
                </h3>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms & Condition
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Refund Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Shipping & Delivery
                    </a>
                  </li>
                </ul>
              </div>

              {/* Services Column */}
              <div>
                <h3 className="text-white font-semibold mb-2 text-base">
                  Services
                </h3>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Bidding
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Turnkey Projects
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Sell Old Items
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Maintenance
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side - Flags, Apps, Social */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-1 pb-4">
                {/* India Flag */}
                <div className="w-7 h-5 rounded-full overflow-hidden border border-gray-600">
                  <div className="w-full h-1/3 bg-orange-500"></div>
                  <div className="w-full h-1/3 bg-white"></div>
                  <div className="w-full h-1/3 bg-green-600"></div>
                </div>

                {/* UAE Flag */}
                <div className="w-7 h-5 rounded-full overflow-hidden border border-gray-600 relative">
                  <div className="absolute left-0 top-0 w-1/4 h-full bg-red-600"></div>
                  <div className="absolute left-1/4 top-0 w-3/4 h-1/3 bg-green-600"></div>
                  <div className="absolute left-1/4 top-1/3 w-3/4 h-1/3 bg-white"></div>
                  <div className="absolute left-1/4 top-2/3 w-3/4 h-1/3 bg-black"></div>
                </div>

                {/* Australia Flag */}
                <div className="w-7 h-5 rounded-full overflow-hidden border border-gray-600 bg-blue-800 relative">
                  {/* Union Jack corner */}
                  <div className="absolute left-0 top-0 w-1/2 h-1/2 bg-blue-900">
                    <div
                      className="absolute inset-0 bg-red-600"
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 0, 100% 20%, 20% 20%, 20% 100%, 0 100%)",
                      }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-white"
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 0, 100% 10%, 10% 10%, 10% 100%, 0 100%)",
                      }}
                    ></div>
                  </div>
                  {/* Stars */}
                  <div className="absolute right-1 top-1 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute right-2 bottom-1 w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Google Play Button */}
                <div className="bg-black rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <svg className="size-8" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.61 3 21.09 3 20.5Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M16.81 15.12L6.05 21.34C5.79 21.48 5.49 21.48 5.23 21.34L3.84 21.85L13.69 12L16.81 15.12Z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M16.81 8.88L13.69 12L3.84 2.15L5.23 2.66C5.49 2.52 5.79 2.52 6.05 2.66L16.81 8.88Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M16.81 8.88L20.16 10.83C20.84 11.24 20.84 12.76 20.16 13.17L16.81 15.12L13.69 12L16.81 8.88Z"
                      fill="#34A853"
                    />
                  </svg>
                  <div>
                    <div className="text-[10px] text-gray-400">GET IT ON</div>
                    <div className="text-xs font-medium">Google Play</div>
                  </div>
                </div>

                {/* App Store Button */}
                <div className="bg-black rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <svg className="size-8" viewBox="0 0 24 24" fill="white">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.19 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                  </svg>
                  <div>
                    <div className="text-[10px] text-gray-400">
                      Download on the
                    </div>
                    <div className="text-xs font-medium">App Store</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2">
                <a
                  href="#"
                  className="flex items-center justify-center"
                >
                  <Twitter className="size-6" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center"
                >
                  <svg
                    className="size-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center"
                >
                  <Linkedin className="size-6" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center"
                >
                  <Instagram className="size-6" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center"
                >
                  <Facebook className="size-6" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center"
                >
                  <Youtube className="size-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="text-center mt-4 pt-2">
            <p className="text-xs text-gray-400">
              Copyright © 2025 PackTok. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
