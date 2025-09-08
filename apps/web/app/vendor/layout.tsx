"use client";

import React from "react";
import VendorDashboardLayout from "./dashboard/layout";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VendorDashboardLayout>{children}</VendorDashboardLayout>;
}
