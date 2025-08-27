import Image from "next/image";
// import CategoryItem from "./category-item";
// import { CategoryItem as CategoryItemType } from "@/types";
import { Button } from "@packtok/ui";
import Link from "next/link";

import Consumables from "@/assets/consumables2.jpg";
import Machinery from "@/assets/machinery4.jpg";
import ManPower from "@/assets/man-power2.jpg";
import RawMaterial from "@/assets/raw-matserials3.png";
import Spareparts from "@/assets/spare-parts3.png";

export default function CategoryList() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src={Machinery}
              alt="Machinery Image"
              width={700}
              height={450}
              className="w-[85%] object-cover col-span-2 -translate-y-12 aspect-[6/5] col-start-1 row-start-1"
            />

            <div className="flex items-end col-start-1 row-start-1">
              <Image
                src="/tunkery-icon.png"
                alt="Mahinery Icon"
                width={700}
                height={450}
                className="w-32 object-cover translate-y-12"
              />
            </div>

            <div className="col-start-2 row-start-1 bg-black w-full h-full"></div>
            <div className="col-span-3">
              <div className="bg-black text-white p-12 shadow-2xl min-h-[450px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-white text-center">
                  Machinery
                </h2>
                <p className="text-sm uppercase tracking-widest mb-8 text-center font-semibold">
                  Premium Machinery for Peak Performance
                </p>
                <p className="text-gray-300 mb-10 leading-relaxed text-lg">
                  Explore our extensive range of high-performance machinery
                  designed to boost productivity and efficiency. From
                  industrial-grade heavy equipment to precision tools, we offer
                  reliable solutions for construction, manufacturing,
                  agriculture, and more. Our selection includes top brands,
                  ensuring durability, advanced technology, and exceptional
                  performance. Whether you need excavators, CNC machines,
                  tractors, or generators, we provide competitive pricing and
                  trusted quality. Browse user-friendly listings with detailed
                  specs, images, and customer reviews to make informed
                  decisions. Enjoy seamless purchasing, flexible financing, and
                  expert support. Upgrade your operations today with the best
                  machinery
                </p>
                <Button
                  asChild
                  className="bg-white text-black hover:bg-gray-100 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                >
                  <Link href="/marketplace/machinery">Shop Now</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Maintenance Section */}
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src={Spareparts}
              alt="Spareparts projects"
              width={700}
              height={450}
              className="w-[85%] object-cover col-span-2 -translate-y-12 aspect-[6/5] col-start-4 row-start-1"
            />

            <div className="flex items-end col-start-5 row-start-1">
              <Image
                src="/maintain-icon.png"
                alt="Spareparts Icon"
                width={700}
                height={450}
                className="w-32 object-cover translate-y-12"
              />
            </div>

            <div className="col-start-4 row-start-1 bg-white border-r-2 border-y-2 border-black w-full h-full"></div>
            <div className="col-span-3 row-start-1 col-start-1">
              <div className="bg-white border-l-2 border-y-2 border-black text-black p-12 min-h-[450px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-black text-center">
                  Spare Parts
                </h2>
                <p className="text-sm uppercase tracking-widest mb-8 text-center font-semibold">
                  Smooth Operations Guaranteed
                </p>
                <p className="text-gray-800 mb-10 leading-relaxed text-lg">
                  Upgrade your machinery with our premium spare parts, designed
                  for durability and peak performance. We stock a wide range of
                  genuine components for construction, agriculture, industrial,
                  and automotive equipment—ensuring seamless repairs and minimal
                  downtime. From engine parts to hydraulic components, filters,
                  and bearings, we source only high-quality replacements from
                  trusted manufacturers. Enjoy easy browsing with detailed
                  descriptions, compatibility guides, and competitive pricing.
                  Whether for maintenance or urgent repairs, our spare parts
                  keep your machines running longer and stronger. Shop now for
                  reliable solutions and expert support
                </p>
                <Button
                  asChild
                  className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                >
                  <Link href="/marketplace/spare-parts">Shop Now</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Raw Material Section */}
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src={RawMaterial}
              alt="RawMaterial Image"
              width={700}
              height={450}
              className="w-[85%] object-cover col-span-2 -translate-y-12 aspect-[6/5] col-start-1 row-start-1"
            />

            <div className="flex items-end col-start-1 row-start-1">
              <Image
                src="/consult-icon.png"
                alt="RawMaterial Icon"
                width={700}
                height={450}
                className="w-32 object-cover translate-y-12"
              />
            </div>

            <div className="col-start-2 row-start-1 bg-white border-l-2 border-y-2 border-black w-full h-full"></div>
            <div className="col-span-3">
              <div className="bg-white border-r-2 border-y-2 border-black text-black p-12 min-h-[450px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-black text-center">
                  Raw Material
                </h2>
                <p className="text-sm uppercase tracking-widest mb-8 text-center font-semibold">
                  Quality Uncompromised
                </p>
                <p className="text-gray-800 mb-10 leading-relaxed text-lg">
                  Explore our extensive range of high-performance machinery
                  designed to boost productivity and efficiency. From
                  industrial-grade heavy equipment to precision tools, we offer
                  reliable solutions for construction, manufacturing,
                  agriculture, and more. Our selection includes top brands,
                  ensuring durability, advanced technology, and exceptional
                  performance. Whether you need excavators, CNC machines,
                  tractors, or generators, we provide competitive pricing and
                  trusted quality. Browse user-friendly listings with detailed
                  specs, images, and customer reviews to make informed
                  decisions. Enjoy seamless purchasing, flexible financing, and
                  expert support. Upgrade your operations today with the best
                  machinery
                </p>
                <Button
                  asChild
                  className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                >
                  <Link href="/marketplace/raw-materials">Shop Now</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Consumables Section */}
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src={Consumables}
              alt="Consumables Image"
              width={700}
              height={450}
              className="w-[85%] object-cover col-span-2 -translate-y-12 aspect-[6/5] col-start-4 row-start-1"
            />

            <div className="flex items-end col-start-5 row-start-1">
              <svg
                className="w-32 h-32 text-black translate-y-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
              </svg>
            </div>

            <div className="col-start-4 row-start-1 bg-white border-r-2 border-y-2 border-black w-full h-full"></div>
            <div className="col-span-3 row-start-1 col-start-1">
              <div className="bg-white border-l-2 border-y-2 border-black text-black p-12 min-h-[450px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-black text-center">
                  Consumables
                </h2>
                <p className="text-sm uppercase tracking-widest mb-8 text-center font-semibold">
                  Unstoppable Productivity
                </p>
                <p className="text-gray-800 mb-10 leading-relaxed text-lg">
                  Keep your operations running smoothly with our high-quality
                  consumables, designed for efficiency and durability. From
                  industrial lubricants and welding supplies to safety gear and
                  cutting tools, we stock everything you need to minimize
                  downtime and maximize productivity. Our competitively priced
                  products come from trusted brands, ensuring consistent
                  performance for workshops, factories, and job sites. Whether
                  you need routine replacements or bulk orders, we deliver fast
                  and hassle-free. Reduce waste and optimize costs with our
                  carefully curated selection
                </p>
                <Button
                  asChild
                  className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                >
                  <Link href="/marketplace/consumables">Shop Now</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Man Power Section */}
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src={ManPower}
              alt="Man Power Image"
              width={700}
              height={450}
              className="w-[85%] object-cover col-span-2 -translate-y-12 aspect-[6/5] col-start-1 row-start-1"
            />

            <div className="flex items-end col-start-1 row-start-1">
              <svg
                className="w-32 h-32 text-black translate-y-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
              </svg>
            </div>

            <div className="col-start-2 row-start-1 bg-white border-l-2 border-y-2 border-black w-full h-full"></div>
            <div className="col-span-3">
              <div className="bg-white border-r-2 border-y-2 border-black text-black p-12 min-h-[450px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-black text-center">
                  Man Power
                </h2>
                <p className="text-sm uppercase tracking-widest mb-8 text-center font-semibold">
                  Investment & Acquisition Solutions
                </p>
                <p className="text-gray-800 mb-10 leading-relaxed text-lg">
                  Strategic investment and acquisition services for packaging
                  companies looking to expand or optimize their operations. We
                  provide comprehensive due diligence, valuation, and
                  transaction support for successful business transformations.
                </p>
                <Button className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg">
                  Shop Now
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
