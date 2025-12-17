import { Footer, Navbar } from "@/components";
import { ClientMobileInterstitial } from "@/components/client-mobile-interstitial";
import "@packtok/ui/globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import React from "react";
import "../styles/globals.css";
import Providers from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Packtok",
  description: "Complete Packaging Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <Providers>
          {/* Mobile/Tablet view: show interstitial only */}
          <div className="block lg:hidden">
            <ClientMobileInterstitial />
          </div>

          {/* Desktop/Laptop view: show full site */}
          <div className="hidden lg:block">
            <Navbar />
            {/* <ClientEventProvider /> */}
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
