import { PageHeader } from "@/components";
import React from "react";

export default function PodcastsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="bg-white">
      <div className="w-[85%] mx-auto">
        <PageHeader
          title="Podcasts"
          subtitle="Industry insights, packaging trends, and expert conversations."
          image="/podcast.jpg"
        />
      </div>
      <div className="w-[85%] mx-auto py-8">{children}</div>
    </section>
  );
}
