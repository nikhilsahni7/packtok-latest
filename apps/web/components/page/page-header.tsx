import Image, { StaticImageData } from "next/image";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  image: StaticImageData | string;
};

export default function PageHeader({
  title,
  subtitle,
  image,
}: PageHeaderProps) {
  return (
    <div className=" h-full w-full">
      <div className="relative h-[431px]">
        <Image src={image} alt={title} fill className="object-cover  h-[431px]" />
      </div>

      <div className="bg-black border-y-[3px] border-[#FE7B02] flex flex-col py-2 items-center justify-center z-20">
        <h1 className="font-medium text-[40px]  text-white ">
          {title}
        </h1>
        <h2 className="text-shadow-md text-white md:text-base text-sm text-center">
          {subtitle}
        </h2>
      </div>
    </div>
  );
}
