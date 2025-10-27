"use client";

import PodcastCard from "@/components/podcasts/podcast-card";
import { MOCK_PODCASTS } from "@/lib/podcast-data";
import { Filter, Search, Sparkles, TrendingUp, X } from "lucide-react";
import { useState } from "react";

export default function PodcastsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(
    new Set(MOCK_PODCASTS.flatMap((podcast) => podcast.tags))
  );

  // Filter podcasts based on search term and selected tag
  const filteredPodcasts = MOCK_PODCASTS.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTag = selectedTag ? podcast.tags.includes(selectedTag) : true;

    return matchesSearch && matchesTag;
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Industry Podcasts
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Packaging
              <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Insights
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Expert conversations, industry trends, and innovations shaping the
              future of packaging
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search podcasts, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-16 pr-16 py-5 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 shadow-lg shadow-gray-200/50 transition-all text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-6 flex items-center hover:scale-110 transition-transform"
                >
                  <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tags */}
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Filter className="w-4 h-4" />
                <span>Topics:</span>
              </div>
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === null
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          {(searchTerm || selectedTag) && (
            <div className="text-center mt-8">
              <p className="text-gray-600 font-medium">
                <span className="text-orange-600 font-bold">
                  {filteredPodcasts.length}
                </span>{" "}
                {filteredPodcasts.length === 1 ? "podcast" : "podcasts"} found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Podcasts Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredPodcasts.length > 0 ? (
          <>
            {/* Featured/Latest Section */}
            {!searchTerm && !selectedTag && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    Latest Episodes
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPodcasts.map((podcast) => (
                    <PodcastCard key={podcast.id} podcast={podcast} />
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {(searchTerm || selectedTag) && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  {searchTerm ? "Search Results" : `${selectedTag} Podcasts`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPodcasts.map((podcast) => (
                    <PodcastCard key={podcast.id} podcast={podcast} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />
                <Search className="relative h-20 w-20 text-gray-300" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No podcasts found
            </h3>
            <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
              We couldn&apos;t find any podcasts matching your criteria. Try
              adjusting your search or filters.
            </p>
            <div className="flex gap-4 justify-center">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors shadow-lg shadow-orange-500/30"
                >
                  Clear search
                </button>
              )}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      {!searchTerm && !selectedTag && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-purple-600 rounded-3xl p-12 md:p-16 text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Never Miss an Episode
              </h2>
              <p className="text-xl md:text-2xl text-orange-50 mb-8 leading-relaxed">
                Subscribe to get notified about new episodes, exclusive content,
                and industry insights delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg flex-1 max-w-md"
                />
                <button className="px-8 py-4 bg-white text-orange-600 font-bold rounded-full hover:bg-orange-50 transition-colors shadow-xl text-lg whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
