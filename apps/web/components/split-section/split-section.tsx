import { ArrowRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type SplitSectionProps = {
  title: string;
  description: string;
  image: StaticImageData | string;
};

export default function SplitSection({
  title,
  description,
  image,
}: SplitSectionProps) {
  return (
    <div>
      <div className="flex flex-col lg:flex-row h-auto sm:h-[35vh] md:h-[40vh] lg:h-[45vh]">
        {/* Left side - Image */}
        <div className="w-full lg:w-1/2 h-24 sm:h-40 md:h-52 lg:h-full">
          <Image
            src={image}
            alt="Featured product"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Text content */}
        <div className="w-full lg:w-1/2 bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-3 sm:mb-4 font-bold">
            {title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed text-justify">
            {description}
          </p>
          <Link
            href={"/marketplace"}
            className="flex items-center border-b w-fit text-sm sm:text-base gap-2"
          >
            Shop Now
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
