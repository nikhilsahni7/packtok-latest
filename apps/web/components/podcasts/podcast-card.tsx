"use client";

import { PodcastListItem } from "@/types/podcast";
import { formatDate, formatDuration } from "@/utils/podcast-utils";
import { Clock, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PodcastCardProps {
  podcast: PodcastListItem;
}

export default function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link href={`/podcasts/${podcast.id}`} className="group block">
      <div className="relative w-full">
        {/* Thumbnail Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
          <Image
            src={podcast.thumbnailUrl || "/placeholder-product.jpg"}
            alt={podcast.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={95}
            priority={false}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Play Button - Centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300 ease-out">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-60 animate-pulse" />
                <div className="relative bg-white/95 backdrop-blur-sm rounded-full p-5 shadow-2xl">
                  <Play className="w-8 h-8 text-orange-500 fill-orange-500 translate-x-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {typeof podcast.duration === "number"
                ? formatDuration(podcast.duration)
                : "--:--"}
            </span>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="space-y-2">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                {podcast.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white/20 backdrop-blur-md text-white font-medium px-2.5 py-1 rounded-full border border-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Below Image */}
        <div className="mt-5 space-y-2">
          {/* Title */}
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors duration-300">
            {podcast.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {podcast.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-500 font-medium">
              {podcast.releaseDate ? formatDate(podcast.releaseDate) : "TBA"}
            </span>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-orange-500">❤</span>
                <span className="font-medium">{podcast.likeCount}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-blue-500">💬</span>
                <span className="font-medium">{podcast.commentCount}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
