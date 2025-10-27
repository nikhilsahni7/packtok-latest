import Image from "next/image";
// import CategoryItem from "./category-item";
// import { CategoryItem as CategoryItemType } from "@/types";
import { Button } from "@packtok/ui";
import Link from "next/link";

import Consumables from "@/assets/consumables2.jpg";
import Ellipse from "@/assets/Ellipse.png";
import Ellipse_consumables from "@/assets/Ellipse_consumables.png";
import Machinery from "@/assets/Machinery_1.jpg";
import ManPower from "@/assets/man-power2.jpg";
import man_power_bg from "@/assets/man_power_bg.png";
import RawMaterial from "@/assets/Raw material.webp";
import spare from "@/assets/spare_part_1.png";

export default function CategoryList() {
  return (
    <div className="relative z-0 marketplace-bg overflow-hidden ">
      <div className="w-[95%]  mx-auto px-4 py-20 ">
        <section className={`grid grid-cols-1 md:grid-cols-5 py-18  `}>
          <Image
            src={Machinery}
            alt="Machinery Image"
            width={700}
            height={450}
            className="w-full border border-[#000] object-cover col-span-2 -translate-y-12  col-start-1 row-start-1"
          />

          <div className="flex  items-end col-start-1 row-start-1">
            <Image
              src="/tunkery-icon.png"
              alt="Mahinery Icon"
              width={700}
              height={450}
              className="w-32 object-cover translate-y-12"
            />
          </div>

          <div className="col-start-2 row-start-1 bg-black w-full  h-[569px]"></div>
          <div className="col-span-3 relative">
            <div className="bg-black text-white p-12 shadow-2xl min-h-[569px] flex flex-col justify-center">
              <h2 className="text-5xl font-bold mb-6 text-white text-center">
                Machinery
              </h2>
              <p className="text-[18px] uppercase tracking-widest mb-8 text-center font-medium">
                Premium Machinery for Peak Performance
              </p>
              <div className="w-[521px] mx-auto">
                <p className=" text-gray-300 mb-10 leading-relaxed text-[12px] text-justify">
                  At PackTok, we deliver Premium machinery, built to last. Engineered for peak performance, Driven by precision and power. Efficiency meets reliability,
Your production, our priority. Performance without precision is just noise. At PackTok, we fine-tune every component to ensure seamless, powerful, and accurate output — because even the smallest detail matters when you&apos;re operating at scale.
                </p>
                <Button
                  asChild
                  className="bg-white text-black hover:bg-gray-100 px-10 py-6 rounded-md font-bold w-fit text-lg shadow-lg"
                >
                  <Link href="/marketplace/machinery">Shop Now</Link>
                </Button>
              </div>
            </div>
            <Image
              src={Ellipse}
              alt="Ellipse"
              width={700}
              height={450}
              className="w-32 object-cover absolute z-[-1] -top-15 -right-10"
            />
          </div>
        </section>

        {/* Maintenance Section */}
        <section className="grid relative z-[1] grid-cols-1 md:grid-cols-5 py-18">
          <Image
            src={spare}
            alt="Spareparts projects"
            width={700}
            height={450}
            className="w-full object-cover border  border-r-0 border-[#000] col-span-2 -translate-y-12 aspect-[6/5] col-start-4 row-start-1"
          />

          <div className="flex items-end col-start-5 row-start-1">
            <Image
              src="/maintain-icon.png"
              alt="Spareparts Icon"
              width={700}
              height={450}
              className="w-32 object-cover translate-y-20 translate-x-[70%]"
            />
          </div>

          <div className="col-start-4 row-start-1 bg-white border-r-2 border-y-2 border-black w-full h-[569px]"></div>
          <div className="col-span-3 row-start-1 col-start-1 h-[569px]">
            <div className="bg-white border-l-2 border-y-2 border-black  text-black p-12 min-h-[569px] flex flex-col justify-center">
              <h2 className="text-5xl font-bold mb-6 text-black text-center">
                Spare Parts
              </h2>
              <p className="text-[20px] uppercase tracking-widest mb-8 text-center font-semibold">
                Smooth Operations Guaranteed
              </p>
              <div className="w-[521px] mx-auto">
                <p className="text-gray-800 mb-10 leading-relaxed text-[12px] text-justify">
                  At PackTok, we understand that consistent production depends on the availability of high-quality spare parts. {"That’s"} why we offer a comprehensive range of spare parts and machine components for corrugated and packaging equipment — ensuring smooth operations and reduced downtime.Whether you need replacements for worn-out components or critical parts for emergency repairs, PackTok ensures quick access and reliable delivery — keeping your production line running efficiently.
                </p>
                <div className="text-end">
                  <Button
                    asChild
                    className="bg-black text-white text-end hover:bg-gray-800 px-10 py-6 rounded-md font-bold w-fit text-lg shadow-lg"
                  >
                    <Link href="/marketplace/spare-parts">Shop Now</Link>
                  </Button>
                </div>
              </div>
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
            className="w-full object-cover border border-black col-span-2 -translate-y-12 aspect-[6/5] col-start-1 row-start-1"
          />

          <div className="flex items-end col-start-1 row-start-1">
            <Image
              src="/consult-icon.png"
              alt="RawMaterial Icon"
              width={700}
              height={450}
              className="w-32 object-cover translate-y-20  translate-x-[70%]"
            />
          </div>

          <div className="col-start-2 row-start-1  border-l-2  border-b-2  border-[#000] w-full  h-[569px]"></div>

          <div className="col-span-3">
            <div className="bg-white   border-y-2 border-r-2 border-black  text-black p-12 min-h-[569px] flex flex-col justify-center">
              <h2 className="text-5xl font-bold mb-6 text-black text-center ">
                Raw Material
              </h2>
              <p className="text-[20px] uppercase tracking-widest mb-8 text-center font-semibold">
                Quality Uncompromised
              </p>
              <div className="w-[521px] mx-auto">
                <p className="text-gray-800 mb-10 leading-relaxed text-[12px] text-justify">
                  At PackTok is a trusted destination for sourcing
                  high-quality raw materials used in corrugated and packaging
                  machinery. We offer a complete range including kraft paper,
                  adhesives, inks, starch, and other essential consumables that
                  form the backbone of efficient packaging production. By
                  bringing sellers and buyers together, we make it easier to
                  access reliable materials at competitive prices, ensuring
                  consistency, durability, and cost-effectiveness. Whether
                  you’re a manufacturer looking to streamline supply or a
                  supplier aiming to reach new customers, our platform provides
                  the right space to trade raw materials with ease and
                  confidence.
                </p>
                <Button
                  asChild
                  className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-md font-bold w-fit text-lg shadow-lg"
                >
                  <Link href="/marketplace/raw-materials">Shop Now</Link>
                </Button>
              </div>
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
            className="w-full object-cover col-span-2 border border-[#000] -translate-y-12 aspect-[6/5] col-start-4 row-start-1"
          />

          {/* <div className="flex items-end col-start-5 row-start-1">
            <svg
              className="w-32 h-32 text-black translate-y-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
            </svg>
          </div> */}

          <div className="col-start-4 row-start-1 bg-white border-r-2 border-y-2 border-black w-full h-[569px]"></div>
          <div className="col-span-3 relative row-start-1 col-start-1 h-[569px]">
            <div className="bg-white border-l-2 border-y-2 border-black text-black p-12 min-h-[569px] flex flex-col justify-center">
              <h2 className="text-5xl font-bold mb-6 text-black text-center">
                Consumables
              </h2>
              <p className="text-[20px] uppercase tracking-widest mb-8 text-center font-semibold">
                Unstoppable Productivity
              </p>
              <div className="w-[521px] mx-auto">
                <p className="text-gray-800 mb-10 leading-relaxed text-[12px] text-justify">
                 At PackTok keep your operations running smoothly with our high-quality
                  consumables, designed for efficiency and durability. From
                  industrial lubricants and bopp taps Heavy-duty Woven Cord Strapping rolls bubble  wrap, make ready, Shrink Wrap Stretch Film, Honeycomb Paper Wrap & Sleeves, Food Grade High Transparency Polyolefin Plastic, stitching wire rolls
                </p>
                <div className="text-end">
                  <Button
                    asChild
                    className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-md font-bold w-fit text-lg shadow-lg"
                  >
                    <Link href="/marketplace/consumables">Shop Now</Link>
                  </Button>
                </div>
              </div>
            </div>

            <Image
              src={Ellipse_consumables}
              alt="Consumables Ellipse"
              width={700}
              height={450}
              className="w-68  object-cover  absolute z-[-1] -bottom-30 -right-120"
            />
          </div>
        </section>

        {/* Man Power Section */}
        <section className="grid relative grid-cols-1 md:grid-cols-5 py-18 pt-30">
          <Image
            src={ManPower}
            alt="Man Power Image"
            width={700}
            height={450}
            className="w-full object-cover border border-[#000] col-span-2 -translate-y-12 aspect-[6/5] col-start-1 row-start-1"
          />

          <div className="col-start-2 row-start-1 bg-white border-l-2 border-y-2 border-black w-full h-[569px]"></div>
          <div className="col-span-3  h-[569px]">
            <Image
              src={man_power_bg}
              alt="Man Power Image"
              width={700}
              height={450}
              className="w-40 object-cover  pointer-events-none absolute -top-5 right-0"
            />
            <div className="bg-white border-r-2 border-y-2 border-black text-black p-12 min-h-[569px] flex flex-col justify-center">
              <h2 className="text-5xl font-bold mb-6 text-black text-center">
                Man Power
              </h2>
              <p className="text-[20px] uppercase tracking-widest mb-8 text-center font-semibold">
                Skilled Workforce for the Corrugated & Packaging Industry
              </p>
              <div className="w-[521px] mx-auto">
                <p className="text-gray-800 mb-10 leading-relaxed text-[12px] text-justify">
                At PackTok, we not only provide skilled manpower to the corrugated and packaging industry,
but also create meaningful career opportunities for professionals seeking growth in this field.
Our platform bridges the gap between talent and industry needs, ensuring the right fit every time.
We connect qualified technicians, machine operators, engineers, and supervisors
with companies that value experience, reliability, and dedication.
Empowering both businesses and individuals — that&apos;s the PackTok promise.
                </p>
                <Button
                  asChild
                  className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-md font-bold w-fit text-lg shadow-lg"
                >
                  <Link href="/marketplace/manpower">Book Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
