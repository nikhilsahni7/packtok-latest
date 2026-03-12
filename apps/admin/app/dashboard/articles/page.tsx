"use client";

import { Button } from "@packtok/ui/components/button";
import { Input } from "@packtok/ui/components/input";
import { Textarea } from "@packtok/ui/components/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  AdminArticle,
  useAdminArticles,
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
} from "../../../hooks/useArticles";
import { QK } from "../../../utils/queryKeys";

const EMPTY_FORM = {
  title: "",
  content: "",
  coverImage: "",
  coverImageFile: null as File | null,
  published: true,
};

export default function AdminArticlesPage() {
  const queryClient = useQueryClient();
  const { data: articles = [], isLoading } = useAdminArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [editing, setEditing] = useState<AdminArticle | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const isSubmitting = createArticle.isPending || updateArticle.isPending;
  let submitLabel = "Create Article";
  if (isSubmitting) {
    submitLabel = "Saving...";
  } else if (editing) {
    submitLabel = "Update Article";
  }

  const sortedArticles = useMemo(
    () =>
      [...articles].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [articles]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      content: form.content,
      coverImage: form.coverImage || undefined,
      coverImageFile: form.coverImageFile || undefined,
      published: form.published,
    };

    if (editing) {
      await updateArticle.mutateAsync({ id: editing.id, payload });
    } else {
      await createArticle.mutateAsync(payload);
    }

    setEditing(null);
    setForm(EMPTY_FORM);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onEdit = (article: AdminArticle) => {
    setEditing(article);
    setForm({
      title: article.title,
      content: article.content,
      coverImage: article.coverImage || "",
      coverImageFile: null,
      published: article.published,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDelete = async (id: string) => {
    await deleteArticle.mutateAsync(id);
    if (editing?.id === id) {
      setEditing(null);
      setForm(EMPTY_FORM);
    }
  };

  const onToggleLive = async (article: AdminArticle) => {
    await updateArticle.mutateAsync({
      id: article.id,
      payload: { published: !article.published },
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: QK.articles });
    setRefreshing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-sm text-gray-500">
            Create, edit, delete, and control article visibility on website.
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

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl border p-5 space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {editing ? "Edit Article" : "Create Article"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Article title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <Input
            placeholder="Cover image URL (optional)"
            value={form.coverImage}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, coverImage: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                coverImageFile: e.target.files?.[0] || null,
              }))
            }
          />
          <p className="text-xs text-gray-500">
            Upload cover image (optional). If both URL and file are provided, file
            upload is used.
          </p>
          {(form.coverImageFile || form.coverImage) && (
            <div className="flex items-center gap-3 rounded-md border p-2">
              {!form.coverImageFile && form.coverImage ? (
                <Image
                  src={form.coverImage}
                  alt="Cover preview"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded object-cover"
                />
              ) : null}
              <p className="text-sm text-gray-600 truncate">
                {form.coverImageFile
                  ? `Selected file: ${form.coverImageFile.name}`
                  : form.coverImage}
              </p>
            </div>
          )}
        </div>

        <Textarea
          placeholder="Article content"
          value={form.content}
          onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
          className="min-h-40"
          required
        />

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, published: e.target.checked }))
            }
          />
          <span>Publish (live on website)</span>
        </label>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
          {editing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null);
                setForm(EMPTY_FORM);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold text-gray-900">
            All Articles ({sortedArticles.length})
          </h3>
        </div>

        {isLoading && (
          <div className="p-6 text-sm text-gray-500">Loading articles...</div>
        )}
        {!isLoading && sortedArticles.length === 0 && (
          <div className="p-6 text-sm text-gray-500">No articles found.</div>
        )}
        {!isLoading && sortedArticles.length > 0 && (
          <div className="divide-y">
            {sortedArticles.map((article) => (
              <div key={article.id} className="p-4 flex gap-4 items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{article.title}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(article.createdAt).toLocaleDateString()} •{" "}
                    {article.author?.name || article.author?.email || "Admin"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {article.content}
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={() => onToggleLive(article)}
                      className={`text-xs px-2 py-1 rounded border ${
                        article.published
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {article.published ? "Live" : "Hidden"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(article)}
                    className="p-2 rounded hover:bg-gray-100"
                    title="Edit article"
                  >
                    <Pencil className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => onDelete(article.id)}
                    className="p-2 rounded hover:bg-red-50"
                    title="Delete article"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
