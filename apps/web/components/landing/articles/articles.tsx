
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import article1 from "@/assets/article1.png";
import article2 from "@/assets/article2.png";
import article3 from "@/assets/article3.png";
import Image from "next/image";

const Articles = () => {
    const articles = [
        {
            title: "5 Ways to Maximize Factory Efficiency",
            link: "/test",
            image:  article1,
            id: "Test1"
        },
        {
            title: "Prevent Problems Before They Start",
            link: "/test",
            image:  article2,
            id: "Test1"
        },
        {
            title: "Choosing the Right Spare Parts for Your Machines",
            link: "/test",
            image:  article3,
            id: "Test1"
        }
    ];

  return (
    <section className="py-6 sm:py-8 md:py-10 mx-auto w-[95%] sm:w-[90%] md:w-[80%]">
      <div className="container mx-auto mb-6 sm:mb-8 md:mb-12 flex md:flex-row flex-col justify-between md:items-center items-left gap-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 font-bold">
          Articles
        </h2>
        <Link
          href={"/articles"}
          className="items-center flex border-b-2 border-black w-fit text-sm sm:text-base md:text-lg gap-1"
        >
          More Articles <ArrowRight size={16} className="sm:w-5 sm:h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {
            articles.map(article => (
                <div key={article.id}>
                    <Image alt={article.title} src={article.image} className="aspect-square object-cover" />
                    <h3 className="pb-4 pt-6 text-xl">{article.title}</h3>
                    <a href={article.link} className="border-b-2 border-black">
                        Read More <ArrowRight size={16} className="inline-block sm:w-5 sm:h-5" />
                    </a>
                </div>
            ))
        }
      </div>
    </section>
  );
};

export default Articles;
