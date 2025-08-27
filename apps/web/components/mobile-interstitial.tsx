import Image from "next/image";

import FooterLogo from "@/assets/footer-logo1.png";

export default function MobileInterstitial() {
  return (
    <div className="min-h-dvh w-full bg-black text-white flex flex-col items-center justify-between p-6">
      <header className="w-full flex items-center justify-center pt-2">
        <Image
          src={FooterLogo}
          alt="Packtok"
          width={160}
          height={40}
          priority
        />
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center text-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Mobile app is coming
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-sm">
            Our mobile experience will be available on the App Store and Google
            Play soon. For now, please use Packtok on a desktop or laptop for
            the best experience.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="bg-black rounded-lg px-3 py-2 flex items-center gap-2 border border-gray-700">
            <svg className="size-7" viewBox="0 0 24 24" fill="white">
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.19 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] text-gray-400">Download on the</div>
              <div className="text-xs font-medium">App Store</div>
            </div>
          </div>

          <div className="bg-black rounded-lg px-3 py-2 flex items-center gap-2 border border-gray-700">
            <svg className="size-7" viewBox="0 0 24 24" fill="none">
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
            <div className="text-left">
              <div className="text-[10px] text-gray-400">GET IT ON</div>
              <div className="text-xs font-medium">Google Play</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full text-center pb-2">
        <p className="text-xs text-gray-400">
          Using a phone or tablet? Our mobile apps are coming soon.
        </p>
      </footer>
    </div>
  );
}
