import Ellipse_consumables from "@/assets/Ellipse_consumables.png";
import investment from "@/assets/investment.png";
import service_bg from "@/assets/service_bg.png";
import turnkey_2 from "@/assets/turnkey_2.webp";

import { Button } from "@packtok/ui/components/button";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "../../../components";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className=" bg-gray-900">
        <Image
          src={service_bg}
          alt="Marketplace"
          className="object-cover w-full object-center brightness-110 contrast-110"
          priority
          quality={95}
        />
      </section>

      {/* Services Header */}
      <section className="bg-black py-2 border-y-[3px] border-[#FE7B02]">
        <div className="w-[95%] mx-auto">
          <h1 className="text-[40px] font-medium text-white text-center">
            Services
          </h1>
        </div>
      </section>

      {/* Services Container */}
      <div className="relative marketplace-bg overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        <div className="w-[95%] mx-auto py-20">
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src={turnkey_2}
              alt="Turnkey projects"
              width={700}
              height={450}
              className="w-full object-cover col-span-2 border border-[#000] -translate-y-12 aspect-[6/5] col-start-1 row-start-1"
            />

            <div className="flex items-end col-start-1 row-start-1">
              <Image
                src="/tunkery-icon.png"
                alt="Turnkey Icon"
                width={700}
                height={450}
                className="w-32 object-cover translate-y-20 translate-x-20"
              />
            </div>

            <div className="col-start-2 row-start-1 bg-black w-full h-[580px]"></div>
            <div className="col-span-3 h-[580px]">
              <div className="bg-black text-white p-12 shadow-2xl min-h-[580px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-white text-center">
                  Turnkey projects
                </h2>
                <p className="text-[20px] uppercase tracking-widest mb-8 text-center font-semibold">
                  End-to-end turnkey project solutions
                </p>
                <div className="w-[521px] mx-auto">
                  <p className="text-gray-300 mb-10 leading-relaxed text-[12px] text-justify">
                    Packtak offers end-to-end turnkey project solutions for the
                    packaging industry, managing everything from initial
                    planning and machinery sourcing to installation, testing,
                    and final handover. Our expert team ensures seamless
                    execution, timely delivery, and cost efficiency.
                  </p>
                  <Button
                    asChild
                    className="bg-white text-black hover:bg-gray-100 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                  >
                    <Link href="/services/turnkey-projects">Request</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Maintenance Section */}
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src="/maintenace.png"
              alt="Maintenance projects"
              width={700}
              height={450}
              className="w-full object-cover col-span-2 border border-[#000] -translate-y-12 aspect-[6/5] col-start-4 row-start-1"
            />

            <div className="flex items-end col-start-5 row-start-1">
              <Image
                src="/maintain-icon.png"
                alt="Maintenance Icon"
                width={700}
                height={450}
                className="w-32 object-cover translate-y-20  translate-x-25 "
              />
            </div>

            <div className="col-start-4 row-start-1 bg-white border-r-2 border-y-2 border-black w-full h-[580px]"></div>
            <div className="col-span-3 row-start-1 col-start-1 h-[580px]">
              <div className="bg-white border-l-2 border-y-2 border-black text-black p-12 min-h-[580px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-black text-center">
                  Maintenance
                </h2>
                <p className="text-[20px] uppercase tracking-widest mb-8 text-center font-semibold">
                  Proactive maintenance solutions
                </p>
                <div className="w-[521px] mx-auto">
                  <p className="text-gray-800 mb-10 leading-relaxed text-[12px] text-justify">
                    Our comprehensive maintenance services ensure your packaging
                    equipment operates at peak performance. From preventive
                    maintenance schedules to emergency repairs, we provide
                    round-the-clock support to minimize downtime and maximize
                    productivity.
                  </p>
                  <div className="text-end">
                    <Button
                      asChild
                      className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                    >
                      <Link href="/services/maintenance">Request</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Consultancy Section */}
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src="/consult.png"
              alt="Consultancy projects"
              width={700}
              height={450}
              className="w-full object-cover border border-[#000] col-span-2 -translate-y-12 aspect-[6/5] col-start-1 row-start-1"
            />

            <div className="flex items-end col-start-1 row-start-1">
              <Image
                src="/consult-icon.png"
                alt="Consultancy Icon"
                width={700}
                height={450}
                className="w-32 object-cover translate-y-20 translate-x-25"
              />
            </div>

            <div className="col-start-2 row-start-1 bg-white border-l-2 border-y-2 border-black w-full h-[580px]"></div>
            <div className="col-span-3 h-[580px]">
              <div className="bg-white border-r-2 border-y-2 border-black text-black p-12 min-h-[580px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-black text-center ">
                  Consultancy
                </h2>
                <p className="text-[20px] uppercase tracking-widest mb-8 text-center font-semibold">
                  PackTok&apos;s expert consultancy
                </p>
                <div className="w-[521px] mx-auto">
                  <p className="text-gray-800 mb-10 leading-relaxed text-[12px] text-justify">
                    Packtak offers specialized consultancy services for the
                    packaging industry, delivering strategic guidance to
                    optimize operational efficiency. From process optimization,
                    cost reduction, to sustainable business optimization and
                    consulting solutions.
                  </p>
                  <Button
                    asChild
                    className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                  >
                    <Link href="/services/consultancy">Request</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Buy & Sell Machinery Section */}
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src="/buy-sell.jpg"
              alt="Machinery projects"
              width={700}
              height={450}
              className="w-full object-cover border border-[#000] col-span-2 -translate-y-12 aspect-[6/5] col-start-4 row-start-1"
            />

            <div className="col-start-4 row-start-1 bg-white border-r-2 border-y-2 border-black w-full h-[580px]"></div>
            <div className="col-span-3 relative row-start-1 col-start-1 h-[580px]">
              <div className="bg-white border-l-2 border-y-2 border-black text-black p-12 min-h-[580px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-black text-center">
                  Buy & Sell Machinery
                </h2>
                <p className="text-[20px] uppercase tracking-widest mb-8 text-center font-semibold">
                  Asset Liquidation & Value Recovery
                </p>
                <div className="w-[521px] mx-auto">
                  <p className="text-gray-800 mb-10 leading-relaxed text-[12px] text-justify">
                    PackTok helps packaging companies recover value from
                    underutilized machinery and surplus equipment. We conduct
                    detailed audits and ensure compliance, turning idle
                    inventory into capital while optimizing operational
                    efficiency.
                  </p>
                  <div className="text-end">
                    <Button
                      asChild
                      className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                    >
                      <Link href="/services/sell-old-items">Request</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <Image
                src={Ellipse_consumables}
                alt="Consumables Ellipse"
                width={700}
                height={450}
                className="w-68  object-cover  absolute -bottom-30 -right-120"
              />
            </div>
          </section>

          {/* Investment and Takeover Section */}
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src={investment}
              alt="Investment and Takeover projects"
              width={700}
              height={450}
              className="w-full border border-[#000] object-cover col-span-2 -translate-y-12 aspect-[6/5] col-start-1 row-start-1"
            />

            <div className="col-start-2 row-start-1 bg-white border-l-2 border-y-2 border-black w-full h-[580px]"></div>
            <div className="col-span-3 h-[580px]">
              <div className="bg-white border-r-2 border-y-2 border-black text-black p-12 min-h-[580px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-black text-center">
                  Investment and Takeover
                </h2>
                <p className="text-[20px] uppercase tracking-widest mb-8 text-center font-semibold">
                  Investment & Acquisition Solutions
                </p>
                <div className="w-[521px] mx-auto">
                  <p className="text-gray-800 mb-10 leading-relaxed text-[12px] text-justify">
                    Strategic investment and acquisition services for packaging
                    companies looking to expand or optimize their operations. We
                    provide comprehensive due diligence, valuation, and
                    transaction support for successful business transformations.
                  </p>
                  <Button
                    asChild
                    className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                  >
                    <Link href="/services/investment-and-takeover">
                      Request
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Job Finder Section */}
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src="/machinery-installer.jpg"
              alt="Job Finder projects"
              width={700}
              height={450}
              className="w-full object-cover border border-[#000] col-span-2 -translate-y-12 aspect-[6/5] col-start-4 row-start-1"
            />

            <div className="col-start-4 row-start-1 bg-white border-r-2 border-y-2 border-black w-full h-[580px]"></div>
            <div className="col-span-3 row-start-1 col-start-1 h-[580px]">
              <div className="bg-white border-l-2 border-y-2 border-black text-black p-12 min-h-[580px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-black text-center">
                  Machinery Installer
                </h2>
                <p className="text-[20px] uppercase tracking-widest mb-8 text-center font-semibold">
                  Asset Liquidation & Value Recovery
                </p>
                <div className="w-[521px] mx-auto">
                  <p className="text-gray-800 mb-10 leading-relaxed text-[12px] text-justify">
                    Experienced in installing, aligning, and calibrating corrugated packaging equipment.
                    Proficient with mechanical, electrical, and pneumatic systems.
                    Able to read technical blueprints and ensure safety compliance.
                    Provides training, troubleshooting, and post-installation support.
                  </p>
                  <div className="text-end">
                    <Button
                      asChild
                      className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                    >
                      <Link href="/services/manpower-hiring">Request</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
