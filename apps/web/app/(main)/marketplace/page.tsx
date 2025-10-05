import { CategoryList, Newsletter } from "@/components";
import Image from "next/image";
import marketiplace_bg from "@/assets/marketiplace_bg.png";


export default function Page() {
  return (
    <main>
      {/* Custom Marketplace Header - Full Width Banner */}
      <div className="w-full  fluid-bg ">
        {/* Full Width Image Banner */}
        <div className="relative h-[431px] w-screen ml-[calc(50%-50vw)] overflow-hidden">
          <Image
            src={marketiplace_bg}
            alt="Marketplace"
            fill
            className="object-cover object-center brightness-110 contrast-110"
            priority
            quality={95}
          />
        </div>

        {/* Black Band with Text */}
        <div className="bg-black border-y-[3px] border-[#FE7B02] text-white py-2 px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-[40px]  font-medium ">
              Marketplace
            </h1>

            <h2 className="text-shadow-md text-white md:text-base text-sm text-center">
              Connecting Buyers with Quality Packaging Solutions
            </h2>
          </div>
        </div>
      </div>

      <CategoryList />
      <Newsletter />
    </main>
  );
}
