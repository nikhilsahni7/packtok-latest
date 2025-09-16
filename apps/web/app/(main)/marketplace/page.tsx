import { CategoryList, Newsletter } from "@/components";
import Image from "next/image";

export default function Page() {
  return (
    <main>
      {/* Custom Marketplace Header - Full Width Banner */}
      <div className="w-full mt-16">
        {/* Full Width Image Banner */}
        <div className="relative h-[50vh] w-screen ml-[calc(50%-50vw)] overflow-hidden">
          <Image
            src="/marketplace.png"
            alt="Marketplace"
            fill
            className="object-cover object-center brightness-110 contrast-110"
            priority
            quality={95}
          />
        </div>

        {/* Black Band with Text */}
        <div className="bg-black text-white py-6 px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
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
