"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useArticles } from "@/hooks";
import Image from "next/image";
import articleFallback from "@/assets/article1.png";

const Articles = () => {
  const { data: articles = [] } = useArticles(3);

  return (
    <section className="py-6 sm:py-8 md:py-10 mx-auto w-[95%] sm:w-[90%] md:w-[80%]">
      <div className="container mx-auto mb-6 sm:mb-8 md:mb-12 flex md:flex-row flex-col justify-between md:items-center items-left gap-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 font-bold">
        Packaging  Articles
        </h2>
        <Link
          href={"/articles"}
          className="items-center flex border-b-2 border-black w-fit text-sm sm:text-base md:text-lg gap-1"
        >
          More Articles <ArrowRight size={16} className="sm:w-5 sm:h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {
            articles.map(article => (
                <div key={article.id}>
                    <Image
                      alt={article.title}
                      src={article.coverImage || articleFallback}
                      width={640}
                      height={400}
                      className="aspect-square object-cover"
                    />
                    <h3 className="pb-4 pt-6 text-xl line-clamp-2">{article.title}</h3>
                    <Link href={`/articles/${article.id}`} className="border-b-2 border-black">
                        Read More <ArrowRight size={16} className="inline-block sm:w-5 sm:h-5" />
                    </Link>
                </div>
            ))
        }
      </div>
    </section>
  );
};

export default Articles;
