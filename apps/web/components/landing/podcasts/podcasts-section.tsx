"use client";

import { usePodcasts } from "@/hooks/usePodcasts";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PodcastCard from "../../podcasts/podcast-card";

const PodcastsSection = () => {
  const { data, isLoading } = usePodcasts({ limit: 3 });
  const featuredPodcasts = data?.items ?? [];

  return (
    <section className="py-6 sm:py-8 md:py-10 mx-auto w-[95%] sm:w-[90%] md:w-[80%]">
      <div className="container mx-auto mb-6 sm:mb-8 md:mb-12 flex md:flex-row flex-col justify-between md:items-center items-left gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 font-bold mb-2">
            Industry Podcasts
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Expert insights and discussions on packaging industry trends
          </p>
        </div>
        <Link
          href="/podcasts"
          className="items-center flex border-b-2 border-black w-fit text-sm sm:text-base md:text-lg gap-1 hover:text-orange-500 hover:border-orange-500 transition-colors"
        >
          View All Podcasts <ArrowRight size={16} className="sm:w-5 sm:h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading podcasts...</p>
        ) : (
          featuredPodcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))
        )}
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <Link
          href="/podcasts"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Explore All Podcasts
        </Link>
      </div>
    </section>
  );
};

export default PodcastsSection;
