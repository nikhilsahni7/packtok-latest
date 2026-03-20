"use client";

import {
  useAddPodcastComment,
  useDeletePodcastComment,
  usePodcast,
  usePodcastComments,
  usePodcasts,
  useReactToPodcast,
  useUpdatePodcastComment,
} from "@/hooks/usePodcasts";
import { useAuthStore } from "@/store/auth-store";
import { PodcastReactionType } from "@/types/podcast";
import {
  extractYouTubeId,
  formatDate,
  formatDuration,
  getRelativeTime,
} from "@/utils/podcast-utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Pencil,
  Heart,
  MessageCircle,
  Play,
  Send,
  Share2,
  Trash2,
  Check,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "react-hot-toast";

interface PodcastDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PodcastDetailPage({
  params,
}: Readonly<PodcastDetailPageProps>) {
  const router = useRouter();
  const resolvedParams = use(params);
  const podcastId = resolvedParams.id;
  const { data: podcast, isLoading } = usePodcast(podcastId);
  const { data: commentsPage } = usePodcastComments(podcastId, 20);
  const { data: relatedPage } = usePodcasts({ limit: 8 });
  const reactToPodcast = useReactToPodcast(podcastId);
  const addComment = useAddPodcastComment(podcastId);
  const updateComment = useUpdatePodcastComment(podcastId);
  const deleteComment = useDeletePodcastComment(podcastId);
  const currentUser = useAuthStore((s) => s.user);

  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  const comments = commentsPage?.items ?? [];
  const relatedPodcasts = (relatedPage?.items ?? [])
    .filter((p) => p.id !== podcast?.id)
    .slice(0, 4);

  const youtubeVideoId = podcast?.videoUrl ? extractYouTubeId(podcast.videoUrl) : null;
  const embedUrl = youtubeVideoId
    ? `https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading podcast...
      </div>
    );
  }

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

  const handleReaction = (type: PodcastReactionType) => {
    reactToPodcast.mutate(type, {
      onError: () => {
        toast.error("Please login to react");
      },
    });
  };

  const handleShare = async () => {
    const shareUrl = globalThis.window?.location?.href || podcast.videoUrl || "";
    if (navigator.share) {
      await navigator.share({
        title: podcast.title,
        text: podcast.description,
        url: shareUrl,
      });
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied");
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment.mutateAsync({ content: newComment.trim() });
      setNewComment("");
    } catch {
      // handled in hook
    }
  };

  const handleEditStart = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditedCommentText(content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditedCommentText("");
  };

  const handleEditSave = async (commentId: string) => {
    if (!editedCommentText.trim()) return;

    try {
      await updateComment.mutateAsync({
        commentId,
        content: editedCommentText.trim(),
      });
      setEditingCommentId(null);
      setEditedCommentText("");
    } catch {
      // Mutation handles errors.
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmed = globalThis.window?.confirm(
      "Delete this comment? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteComment.mutateAsync(commentId);
      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setEditedCommentText("");
      }
    } catch {
      // Mutation handles errors.
    }
  };

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
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={podcast.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={podcast.videoUrl || undefined}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <track
                    kind="captions"
                    src="data:text/vtt,WEBVTT"
                    srcLang="en"
                    label="English captions"
                  />
                </video>
              )}
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
                    {podcast.releaseDate ? formatDate(podcast.releaseDate) : "TBA"}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {typeof podcast.duration === "number"
                      ? formatDuration(podcast.duration)
                      : "--:--"}
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
                  onClick={() => handleReaction("LIKE")}
                  className={`group flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                    podcast.userReaction === "LIKE"
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      podcast.userReaction === "LIKE" ? "fill-current" : ""
                    }`}
                  />
                  <span>{podcast.likeCount}</span>
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
                  <span>{podcast.commentCount} Comments</span>
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
                  {podcast.tags.map((tag) => (
                    <span
                      key={tag}
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
                Comments{" "}
                <span className="ml-3 text-xl text-gray-500 font-normal">
                  ({comments.length})
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
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={comment.user.profile_image || "/img/person-placeholder.jpg"}
                        alt={comment.user.name}
                        width={48}
                            <div className="flex items-center gap-3">
                              <h4 className="font-bold text-gray-900">
                                {comment.user.name}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {getRelativeTime(comment.createdAt)}
                              </span>
                            </div>

                            {currentUser?.id === comment.userId ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleEditStart(comment.id, comment.content)
                                  }
                                  className="p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                                  aria-label="Edit comment"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  aria-label="Delete comment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ) : null}
                          </div>

                          {editingCommentId === comment.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={editedCommentText}
                                onChange={(e) => setEditedCommentText(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none"
                                rows={3}
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={handleEditCancel}
                                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleEditSave(comment.id)}
                                  disabled={
                                    !editedCommentText.trim() || updateComment.isPending
                                  }
                                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                  <Check className="w-4 h-4" />
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-700 leading-relaxed">
                              {comment.content}
                            </p>
                          )}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {getRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                      {comment.replyCount ? (
                        <p className="mt-2 text-sm text-gray-500">
                          {comment.replyCount} replies
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
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
                  {relatedPodcasts.map((relatedPodcast) => (
                    <a
                      key={relatedPodcast.id}
                      href={`/podcasts/${relatedPodcast.id}`}
                      className="block group"
                    >
                      <div className="bg-gray-50 rounded-2xl overflow-hidden hover:bg-gray-100 transition-all hover:shadow-lg">
                        <div className="relative aspect-video">
                          <Image
                            src={
                              relatedPodcast.thumbnailUrl ||
                              "/placeholder-product.jpg"
                            }
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
                            <span>
                              {typeof relatedPodcast.duration === "number"
                                ? formatDuration(relatedPodcast.duration)
                                : "--:--"}
                            </span>
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
