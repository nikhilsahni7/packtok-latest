"use client";

import dynamic from "next/dynamic";

const MobileInterstitial = dynamic(
  () => import("@/components/mobile-interstitial"),
  { ssr: false }
);

export function ClientMobileInterstitial() {
  return <MobileInterstitial />;
}
