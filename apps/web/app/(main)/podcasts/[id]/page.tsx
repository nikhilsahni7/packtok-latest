"use client";

import { MOCK_COMMENTS, MOCK_PODCASTS } from "@/lib/podcast-data";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Heart,
    MessageCircle,
    Play,
    Send,
    Share2,
    ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

interface PodcastDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PodcastDetailPage({ params }: PodcastDetailPageProps) {
  const router = useRouter();
  // Next.js 16: params is a Promise in client components, use React.use() to unwrap
  const resolvedParams = use(params);
  const podcast = MOCK_PODCASTS.find((p) => p.id === resolvedParams.id);

  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(podcast?.likes || 0);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  if (!podcast) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Podcast not found
          </h2>
          <button
            onClick={() => router.back()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    if (isLiked) {
      setLocalLikes((prev) => prev - 1);
    } else {
      setLocalLikes((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${podcast.videoId}`;
    if (navigator.share) {
      navigator.share({
        title: podcast.title,
        text: podcast.description,
        url: youtubeUrl,
      });
    } else {
      window.open(youtubeUrl, "_blank");
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // TODO: Add comment via API
      console.log("Adding comment:", newComment);
      setNewComment("");
    }
  };

  const displayedComments = showAllComments
    ? MOCK_COMMENTS
    : MOCK_COMMENTS.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section with Back Button */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-purple-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Podcasts</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Video Player with Modern Shadow */}
            <div className="relative aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl mb-8 ring-1 ring-gray-900/5">
              <iframe
                src={`https://www.youtube.com/embed/${podcast.videoId}?rel=0&modestbranding=1`}
                title={podcast.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Podcast Info Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg ring-1 ring-gray-900/5 mb-8">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {podcast.title}
              </h1>

              {/* Meta Info Pills */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {podcast.publishedAt}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {podcast.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                  <Play className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">
                    Episode
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-gray-200">
                <button
                  onClick={handleLike}
                  className={`group flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                    isLiked
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isLiked ? "fill-current" : ""
                    }`}
                  />
                  <span>{localLikes}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>

                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-semibold">
                  <MessageCircle className="w-5 h-5" />
                  <span>{podcast.comments} Comments</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Episode
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {podcast.description}
                </p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {podcast.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-orange-50 to-purple-50 text-orange-700 border border-orange-200 px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-md transition-shadow cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg ring-1 ring-gray-900/5">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Comments
                <span className="ml-3 text-xl text-gray-500 font-normal">
                  ({MOCK_COMMENTS.length})
                </span>
              </h2>

              {/* Add Comment Form */}
              <div className="mb-10">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">You</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition-all text-gray-900 placeholder-gray-400"
                      rows={4}
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg disabled:shadow-none"
                      >
                        <Send className="w-5 h-5" />
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {displayedComments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={comment.avatar}
                        alt={comment.user}
                        width={48}
                        height={48}
                        className="rounded-full ring-2 ring-gray-100"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900">
                            {comment.user}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {comment.comment}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-6">
                        <button className="group flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium">
                          <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More Comments Button */}
              {MOCK_COMMENTS.length > 3 && !showAllComments && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowAllComments(true)}
                    className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full transition-colors"
                  >
                    View {MOCK_COMMENTS.length - 3} more{" "}
                    {MOCK_COMMENTS.length - 3 === 1 ? "comment" : "comments"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Related Podcasts */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <div className="bg-white rounded-3xl p-6 shadow-lg ring-1 ring-gray-900/5">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  More Episodes
                </h3>
                <div className="space-y-4">
                  {MOCK_PODCASTS.filter((p) => p.id !== podcast.id)
                    .slice(0, 4)
                    .map((relatedPodcast) => (
                      <a
                        key={relatedPodcast.id}
                        href={`/podcasts/${relatedPodcast.id}`}
                        className="block group"
                      >
                        <div className="bg-gray-50 rounded-2xl overflow-hidden hover:bg-gray-100 transition-all hover:shadow-lg">
                          <div className="relative aspect-video">
                            <Image
                              src={relatedPodcast.thumbnail}
                              alt={relatedPodcast.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white/90 rounded-full p-3">
                                <Play className="w-6 h-6 text-orange-500 fill-orange-500" />
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-orange-500 transition-colors mb-2">
                              {relatedPodcast.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{relatedPodcast.duration}</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
