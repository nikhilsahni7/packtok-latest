import Consumables from "@/assets/Consumables1.png";
import machinery from "@/assets/machines_1.png";
import ManPower from "@/assets/Man Power.png";
import RawMaterials from "@/assets/Raw Materials.png";

import SparePart from "@/assets/Spare-Part1.png";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ShopNow() {
  return (
    <div
      className={`flex gap-2 sm:gap-3 md:gap-4 w-[95%] sm:w-[90%] md:w-[80%] mx-auto grid grid-cols-2`}
    >
      {/* Left Rectangle*/}
      <div className="bg-gray-100  justify-between row-span-2">
        <div className="p-4 sm:p-7 md:p-10 md:pt-20 md:pl-15">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl mb-4 font-medium">
            Machinery
          </h2>
          <Link
            href={"/marketplace/machinery"}
            className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed border-b border-gray-800 inline-flex items-center gap-1"
          >
            Shop Now <ArrowRight className="inline-block" size={16} />
          </Link>
        </div>
        <Image
          src={machinery}
          alt="machinery"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Top Right Rectangle */}
      <div className="bg-gray-100 p-2 sm:p-4 md:p-10 flex flex-col sm:flex-row items-center md:pt-0 sm:pt-0 md:pr-0 sm:pr-0 gap-2 sm:gap-4 md:gap-6">
        <div className="flex-1 relative top-29">
          <h3 className="text-lg sm:text-xl md:text-[2.125rem] mb-4 font-medium">
            Spare Parts
          </h3>
          <Link
            href={"/marketplace/spare-parts"}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-left border-b border-gray-800 inline-flex items-center gap-1"
          >
            Shop Now <ArrowRight className="inline-block" size={16} />
          </Link>
        </div>
        <div className="w-[55%]">
          <Image
            src={SparePart}
            height={500}
            width={500}
            alt="spare parts"
            className="object-cover w-full"
          />
        </div>
      </div>

      {/* Bottom Right Rectangle */}
      <div className="bg-gray-100 p-2 sm:p-4 md:p-10 flex flex-col sm:flex-row items-center md:pt-0 sm:pt-0  md:pr-0 sm:pr-0 gap-2 sm:gap-4 md:gap-6">
        <div className="flex-1 relative top-29">
          <h3 className="text-lg sm:text-xl md:text-[2.125rem] mb-4 font-medium">
            Raw Materials
          </h3>
          <Link
            href={"/marketplace/raw-materials"}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-left border-b border-gray-800 inline-flex items-center gap-1"
          >
            Shop Now <ArrowRight className="inline-block" size={16} />
          </Link>
        </div>
        <div className="w-[50%]">
          <Image
            src={RawMaterials}
            width={500}
            height={500}
            alt="raw materials"
            className="object-cover w-full"
          />
        </div>
      </div>

      <div className="bg-gray-100 p-2 sm:p-4 md:p-10 md:pt-0 sm:pt-0  flex md:pt-0 lg:pt-0 flex-col sm:flex-row items-center  gap-2 sm:gap-4 md:gap-6">
        <div className="flex-1 relative top-29">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-4xl mb-4 font-medium">
            Consumables
          </h3>
          <Link
            href={"/marketplace/consumables"}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-left border-b border-gray-800 inline-flex items-center gap-1"
          >
            Shop Now <ArrowRight className="inline-block" size={16} />
          </Link>
        </div>
        <div className="w-[50%]">
          <Image
            src={Consumables}
            alt="consumables"
            className="object-cover w-full"
          />
        </div>
      </div>

      <div className="bg-gray-100 p-2 sm:p-4 md:p-10   flex flex-col sm:flex-row md:pt-5 lg:pt-0 items-center gap-2 sm:gap-4 md:gap-6">
        <div className="flex-1 relative top-29">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-4xl mb-4 font-medium">
            Man Power
          </h3>
          <Link
            href="/services/manpower-hiring"
            className="text-xs sm:text-sm md:text-base lg:text-lg text-left border-b border-gray-800 inline-flex items-center gap-1"
          >
            Shop Now <ArrowRight className="inline-block" size={16} />
          </Link>
        </div>
        <div className="w-[50%]">
          <Image
            src={ManPower}
            alt="man power"
            className="object-cover w-full"
          />
        </div>
      </div>
    </div>
  );
}
