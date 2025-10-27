import React from "react";

export default function PodcastsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="bg-gradient-to-b from-gray-50 via-white to-gray-50 min-h-screen">
      {children}
    </section>
  );
}
