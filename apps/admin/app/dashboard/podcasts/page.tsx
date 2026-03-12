"use client";

import { Button } from "@packtok/ui/components/button";
import { Input } from "@packtok/ui/components/input";
import { Textarea } from "@packtok/ui/components/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Plus, RefreshCw, UploadCloud } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  PodcastStatus,
  useAdminPodcast,
  useAdminPodcasts,
  useCreatePodcast,
  useCreateSeries,
  useDeletePodcast,
  usePodcastSeries,
  useRetryPodcastUpload,
  useUpdatePodcast,
  useUpdatePodcastStatus,
} from "../../../hooks/usePodcasts";
import { QK } from "../../../utils/queryKeys";

const PODCAST_MAX_SIZE_MB = 800;

const EMPTY_PODCAST_FORM = {
  title: "",
  description: "",
  status: "DRAFT" as PodcastStatus,
  releaseDate: "",
  duration: "",
  seriesId: "",
  episodeNumber: "",
  tags: "",
  video: null as File | null,
  thumbnail: null as File | null,
};

export default function AdminPodcastsPage() {
  const queryClient = useQueryClient();
  const { data: podcasts = [], isLoading } = useAdminPodcasts();
  const { data: series = [] } = usePodcastSeries();
  const createPodcast = useCreatePodcast();
  const updatePodcast = useUpdatePodcast();
  const createSeries = useCreateSeries();
  const deletePodcast = useDeletePodcast();
  const retryUpload = useRetryPodcastUpload();
  const updatePodcastStatus = useUpdatePodcastStatus();

  const [refreshing, setRefreshing] = useState(false);
  const [podcastForm, setPodcastForm] = useState(EMPTY_PODCAST_FORM);
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [seriesCover, setSeriesCover] = useState<File | null>(null);
  const retryInputRef = useRef<HTMLInputElement | null>(null);
  const [retryPodcastId, setRetryPodcastId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [editingPodcastId, setEditingPodcastId] = useState<string | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, PodcastStatus>>(
    {}
  );
  const { data: editingPodcast, isLoading: isLoadingEditingPodcast } =
    useAdminPodcast(editingPodcastId);

  const isEditing = Boolean(editingPodcastId);
  const isSubmitting = createPodcast.isPending || updatePodcast.isPending;
  let submitLabel = "Create Podcast";
  if (isSubmitting) {
    submitLabel = "Saving...";
  } else if (isEditing) {
    submitLabel = "Update Podcast";
  }

  useEffect(() => {
    if (!editingPodcast) return;
    setPodcastForm({
      title: editingPodcast.title,
      description: editingPodcast.description ?? "",
      status: editingPodcast.status,
      releaseDate: editingPodcast.releaseDate
        ? new Date(editingPodcast.releaseDate).toISOString().slice(0, 16)
        : "",
      duration:
        typeof editingPodcast.duration === "number"
          ? String(editingPodcast.duration)
          : "",
      seriesId: editingPodcast.series?.id ?? "",
      episodeNumber:
        typeof editingPodcast.episodeNumber === "number"
          ? String(editingPodcast.episodeNumber)
          : "",
      tags: editingPodcast.tags.join(","),
      video: null,
      thumbnail: null,
    });
  }, [editingPodcast]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QK.podcasts }),
      queryClient.invalidateQueries({ queryKey: QK.podcastSeries }),
    ]);
    setRefreshing(false);
  };

  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSeries.mutateAsync({
      title: seriesTitle,
      description: seriesDescription || undefined,
      coverImage: seriesCover,
    });
    setSeriesTitle("");
    setSeriesDescription("");
    setSeriesCover(null);
  };

  const handleCreatePodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadProgress(0);
    try {
      const payload = {
        title: podcastForm.title,
        description: podcastForm.description,
        status: podcastForm.status,
        releaseDate: podcastForm.releaseDate || undefined,
        duration: podcastForm.duration ? Number(podcastForm.duration) : undefined,
        seriesId: podcastForm.seriesId || undefined,
        episodeNumber: podcastForm.episodeNumber
          ? Number(podcastForm.episodeNumber)
          : undefined,
        tags: podcastForm.tags || undefined,
        video: podcastForm.video,
        thumbnail: podcastForm.thumbnail,
      };

      if (editingPodcastId) {
        await updatePodcast.mutateAsync({
          id: editingPodcastId,
          payload,
          onUploadProgress: (percent) => setUploadProgress(percent),
        });
      } else {
        await createPodcast.mutateAsync({
          payload,
          onUploadProgress: (percent) => setUploadProgress(percent),
        });
      }
      setPodcastForm(EMPTY_PODCAST_FORM);
      setEditingPodcastId(null);
    } finally {
      setUploadProgress(null);
    }
  };

  const onEditPodcast = (id: string) => {
    setEditingPodcastId(id);
  };

  const onCancelEdit = () => {
    setEditingPodcastId(null);
    setPodcastForm(EMPTY_PODCAST_FORM);
    setUploadProgress(null);
  };

  const openRetryPicker = (id: string) => {
    setRetryPodcastId(id);
    retryInputRef.current?.click();
  };

  const handleRetryFileChange = async (file: File | null) => {
    if (!file || !retryPodcastId) return;
    await retryUpload.mutateAsync({ id: retryPodcastId, video: file });
    setRetryPodcastId(null);
  };

  const renderPodcastsContent = (): ReactNode => {
    if (isLoading) {
      return <div className="p-6 text-sm text-gray-500">Loading podcasts...</div>;
    }
    if (podcasts.length === 0) {
      return <div className="p-6 text-sm text-gray-500">No podcasts found.</div>;
    }

    return (
      <div className="divide-y">
        {podcasts.map((item) => {
          const selectedStatus = statusDrafts[item.id] ?? item.status;
          const statusUnchanged = selectedStatus === item.status;

          return (
            <div key={item.id} className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.series?.title || "Standalone"} • Upload:{" "}
                  <span className="font-medium">{item.uploadStatus}</span> • Status:{" "}
                  <span className="font-medium">{item.status}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Likes: {item._count.reactions} • Comments: {item._count.comments} •
                  Views: {item.viewCount}
                </p>
                {item.uploadError ? (
                  <p className="text-xs text-red-600 mt-1">{item.uploadError}</p>
                ) : null}
              </div>
              {item.uploadStatus === "FAILED" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openRetryPicker(item.id)}
                  disabled={retryUpload.isPending}
                >
                  Retry Upload
                </Button>
              ) : null}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onEditPodcast(item.id)}
                >
                  Edit
                </Button>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setStatusDrafts((prev) => ({
                      ...prev,
                      [item.id]: e.target.value as PodcastStatus,
                    }))
                  }
                  className="h-9 rounded-md border px-2 text-xs"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                <Button
                  type="button"
                  variant="outline"
                  disabled={updatePodcastStatus.isPending || statusUnchanged}
                  onClick={() =>
                    updatePodcastStatus.mutate({
                      id: item.id,
                      status: selectedStatus,
                    })
                  }
                >
                  Update Status
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                className="text-red-600"
                onClick={() => deletePodcast.mutate(item.id)}
              >
                Delete
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Podcasts</h1>
          <p className="text-sm text-gray-500">
            Upload podcasts, attach to series, and monitor likes/comments.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Upload behavior and limits
        </p>
        <p className="mt-1">
          Max podcast video size is <strong>{PODCAST_MAX_SIZE_MB}MB</strong>.
          Upload failures currently require a full re-upload (no resume/chunk
          continuation yet). Failed uploads can be retried from this dashboard.
        </p>
      </div>

      <form
        onSubmit={handleCreateSeries}
        className="bg-white rounded-xl border p-5 space-y-3"
      >
        <h2 className="text-lg font-semibold text-gray-900">Create Series</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Series title"
            value={seriesTitle}
            onChange={(e) => setSeriesTitle(e.target.value)}
            required
          />
          <Input
            placeholder="Series description"
            value={seriesDescription}
            onChange={(e) => setSeriesDescription(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setSeriesCover(e.target.files?.[0] || null)}
          />
        </div>
        <Button type="submit" disabled={createSeries.isPending}>
          {createSeries.isPending ? "Creating..." : "Create Series"}
        </Button>
      </form>

      <form
        onSubmit={handleCreatePodcast}
        className="bg-white rounded-xl border p-5 space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {isEditing ? "Edit Podcast / Episode" : "Create Podcast / Episode"}
        </h2>
        {isLoadingEditingPodcast ? (
          <p className="text-xs text-gray-500">Loading podcast details...</p>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Title"
            value={podcastForm.title}
            onChange={(e) =>
              setPodcastForm((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
          <select
            value={podcastForm.status}
            onChange={(e) =>
              setPodcastForm((prev) => ({
                ...prev,
                status: e.target.value as PodcastStatus,
              }))
            }
            className="h-10 rounded-md border px-3 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <Input
            type="datetime-local"
            value={podcastForm.releaseDate}
            onChange={(e) =>
              setPodcastForm((prev) => ({ ...prev, releaseDate: e.target.value }))
            }
          />
          <Input
            type="number"
            min={1}
            placeholder="Duration in seconds"
            value={podcastForm.duration}
            onChange={(e) =>
              setPodcastForm((prev) => ({ ...prev, duration: e.target.value }))
            }
          />
          <select
            value={podcastForm.seriesId}
            onChange={(e) =>
              setPodcastForm((prev) => ({ ...prev, seriesId: e.target.value }))
            }
            className="h-10 rounded-md border px-3 text-sm"
          >
            <option value="">No series</option>
            {series.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <Input
            type="number"
            min={1}
            placeholder="Episode number (if in series)"
            value={podcastForm.episodeNumber}
            onChange={(e) =>
              setPodcastForm((prev) => ({
                ...prev,
                episodeNumber: e.target.value,
              }))
            }
          />
          <Input
            placeholder="Tags (comma separated)"
            value={podcastForm.tags}
            onChange={(e) =>
              setPodcastForm((prev) => ({ ...prev, tags: e.target.value }))
            }
          />
          <div className="text-xs text-gray-500 flex items-center">
            Upload video up to {PODCAST_MAX_SIZE_MB}MB.
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700">
              Main podcast video file
            </p>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setPodcastForm((prev) => ({
                  ...prev,
                  video: e.target.files?.[0] || null,
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700">
              Podcast thumbnail image
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPodcastForm((prev) => ({
                  ...prev,
                  thumbnail: e.target.files?.[0] || null,
                }))
              }
            />
          </div>
        </div>
        {isSubmitting && uploadProgress !== null ? (
          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">
              Uploading file from browser to server: {uploadProgress}%
            </p>
          </div>
        ) : null}
        {!createPodcast.isPending && uploadProgress === null ? (
          <p className="text-xs text-gray-500">
            After file transfer reaches 100%, backend continues background
            processing. Track final result in the list below via Upload status.
          </p>
        ) : null}
        <Textarea
          placeholder="Description"
          value={podcastForm.description}
          onChange={(e) =>
            setPodcastForm((prev) => ({ ...prev, description: e.target.value }))
          }
          className="min-h-28"
          required
        />
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <UploadCloud className="h-4 w-4" />
          {submitLabel}
        </Button>
        {isEditing ? (
          <Button type="button" variant="outline" onClick={onCancelEdit}>
            Cancel Edit
          </Button>
        ) : null}
      </form>

      <input
        ref={retryInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleRetryFileChange(e.target.files?.[0] || null)}
      />

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold text-gray-900">
            All Podcasts ({podcasts.length})
          </h3>
        </div>
        {renderPodcastsContent()}
      </div>
    </div>
  );
}
