"use client";

import articleFallback from "@/assets/article1.png";
import { useArticle } from "@/hooks";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ArticleDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "";
  const { data: article, isLoading, isError } = useArticle(id);

  if (isLoading) {
    return (
      <main className="min-h-screen py-10">
        <div className="mx-auto w-[95%] sm:w-[90%] md:w-[80%] text-sm text-gray-500">
          Loading article...
        </div>
      </main>
    );
  }

  if (isError || !article) {
    return (
      <main className="min-h-screen py-10">
        <div className="mx-auto w-[95%] sm:w-[90%] md:w-[80%] rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-700 mb-4">Article not found.</p>
          <Link href="/articles" className="text-orange-600 hover:underline">
            Back to articles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
      <article className="mx-auto w-[95%] sm:w-[90%] md:w-[82%] lg:w-[72%]">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>

        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl leading-tight sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            {article.title}
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            {new Date(article.createdAt).toLocaleDateString()}
          </div>
        </header>

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm mb-8 sm:mb-10">
          <Image
            alt={article.title}
            src={article.coverImage || articleFallback}
            width={1400}
            height={760}
            className="w-full aspect-[16/9] max-h-[460px] sm:max-h-[520px] object-cover"
            priority
          />
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8 md:p-10 shadow-xs">
          <div className="prose prose-gray prose-p:leading-8 prose-p:text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900 max-w-none">
            {article.content
              .split("\n")
              .filter((line) => line.trim().length > 0)
              .map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
              ))}
          </div>
        </section>
      </article>
    </main>
  );
}
