import { CategoryList, Newsletter } from "@/components";
import Image from "next/image";
import marketiplace_bg from "@/assets/marketiplace_bg.png";


export default function Page() {
  return (
    <main>
      {/* Custom Marketplace Header - Full Width Banner */}
      <div className="w-full  fluid-bg mt-16">
        {/* Full Width Image Banner */}
        <div className="relative h-[50vh] w-screen ml-[calc(50%-50vw)] overflow-hidden">
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
        <div className="bg-black border-y-[3px] border-[#FE7B02] text-white py-6 px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-[43px]  font-medium ">
              Marketplace
            </h1>
          </div>
        </div>
      </div>

      <CategoryList />
      <Newsletter />
    </main>
  );
}
