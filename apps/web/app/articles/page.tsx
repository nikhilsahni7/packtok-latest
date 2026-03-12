"use client";

import articleFallback from "@/assets/article1.png";
import { useArticles } from "@/hooks";
import { ArrowRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ArticlesPage() {
  const { data: articles = [], isLoading } = useArticles();
  const hasArticles = articles.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
      <section className="mx-auto w-[95%] sm:w-[90%] md:w-[82%] lg:w-[78%]">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Packaging Articles
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl">
            Insights, guides, and updates from the packaging industry.
          </p>
        </div>

        {isLoading && <p className="text-sm text-gray-500">Loading articles...</p>}
        {!isLoading && !hasArticles && (
          <div className="rounded-xl border bg-white p-8 text-center text-gray-600">
            No articles are live yet.
          </div>
        )}
        {!isLoading && hasArticles && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-xs hover:shadow-md transition-shadow"
              >
                <Link href={`/articles/${article.id}`} className="block">
                  <div className="overflow-hidden rounded-xl">
                    <Image
                      alt={article.title}
                      src={article.coverImage || articleFallback}
                      width={720}
                      height={480}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                </Link>

                <div className="pt-4">
                  <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  <h2 className="text-xl font-semibold leading-snug text-gray-900 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mt-2 mb-4">
                    {article.content}
                  </p>
                  <Link
                    href={`/articles/${article.id}`}
                    className="inline-flex items-center gap-1 border-b border-gray-900 pb-0.5 text-sm font-medium text-gray-900 hover:text-gray-700 hover:border-gray-700"
                  >
                    Read More
                    <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
