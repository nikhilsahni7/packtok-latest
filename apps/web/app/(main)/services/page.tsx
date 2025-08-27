import { Button } from "@packtok/ui/components/button";
import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "../../../components";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/main-services.png')",
          }}
        />
      </section>

      {/* Services Header */}
      <section className="bg-black py-6 border-y-[3px] border-[#FE7B02]">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center">
            Services
          </h1>
        </div>
      </section>

      {/* Services Container */}
      <div className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src="/tunkery.jpg"
              alt="Turnkey projects"
              width={700}
              height={450}
              className="w-[85%] object-cover col-span-2 -translate-y-12 aspect-[6/5] col-start-1 row-start-1"
            />

            <div className="flex items-end col-start-1 row-start-1">
              <Image
                src="/tunkery-icon.png"
                alt="Turnkey Icon"
                width={700}
                height={450}
                className="w-32 object-cover translate-y-12"
              />
            </div>

            <div className="col-start-2 row-start-1 bg-black w-full h-full"></div>
            <div className="col-span-3">
              <div className="bg-black text-white p-12 shadow-2xl min-h-[450px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-white text-center">
                  Turnkey projects
                </h2>
                <p className="text-sm uppercase tracking-widest mb-8 text-center font-semibold">
                  End-to-end turnkey project solutions
                </p>
                <p className="text-gray-300 mb-10 leading-relaxed text-lg">
                  Packtak offers end-to-end turnkey project solutions for the
                  packaging industry, managing everything from initial planning
                  and machinery sourcing to installation, testing, and final
                  handover. Our expert team ensures seamless execution, timely
                  delivery, and cost efficiency.
                </p>
                <Button
                  asChild
                  className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                >
                  <Link href="/services/turnkey-projects">Request</Link>
                </Button>
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
              className="w-[85%] object-cover col-span-2 -translate-y-12 aspect-[6/5] col-start-4 row-start-1"
            />

            <div className="flex items-end col-start-5 row-start-1">
              <Image
                src="/maintain-icon.png"
                alt="Maintenance Icon"
                width={700}
                height={450}
                className="w-32 object-cover translate-y-12"
              />
            </div>

            <div className="col-start-4 row-start-1 bg-white border-r-2 border-y-2 border-black w-full h-full"></div>
            <div className="col-span-3 row-start-1 col-start-1">
              <div className="bg-white border-l-2 border-y-2 border-black text-black p-12 min-h-[450px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-black text-center">
                  Maintenance
                </h2>
                <p className="text-sm uppercase tracking-widest mb-8 text-center font-semibold">
                  Proactive maintenance solutions
                </p>
                <p className="text-gray-800 mb-10 leading-relaxed text-lg">
                  Our comprehensive maintenance services ensure your packaging
                  equipment operates at peak performance. From preventive
                  maintenance schedules to emergency repairs, we provide
                  round-the-clock support to minimize downtime and maximize
                  productivity.
                </p>
                <Button className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg">
                  Request
                </Button>
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
              className="w-[85%] object-cover col-span-2 -translate-y-12 aspect-[6/5] col-start-1 row-start-1"
            />

            <div className="flex items-end col-start-1 row-start-1">
              <Image
                src="/consult-icon.png"
                alt="Consultancy Icon"
                width={700}
                height={450}
                className="w-32 object-cover translate-y-12"
              />
            </div>

            <div className="col-start-2 row-start-1 bg-white border-l-2 border-y-2 border-black w-full h-full"></div>
            <div className="col-span-3">
              <div className="bg-white border-r-2 border-y-2 border-black text-black p-12 min-h-[450px] flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-6 text-black text-center">
                  Consultancy
                </h2>
                <p className="text-sm uppercase tracking-widest mb-8 text-center font-semibold">
                  PackTok&apos;s expert consultancy
                </p>
                <p className="text-gray-800 mb-10 leading-relaxed text-lg">
                  Packtak offers specialized consultancy services for the
                  packaging industry, delivering strategic guidance to optimize
                  operational efficiency. From process optimization, cost
                  reduction, to sustainable business optimization and consulting
                  solutions.
                </p>
                <Button
                  asChild
                  className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                >
                  <Link href="/services/consultancy">Request</Link>
                </Button>
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
                  Buy & Sell Machinery
                </h2>
                <p className="text-sm uppercase tracking-widest mb-8 text-center font-semibold">
                  Asset Liquidation & Value Recovery
                </p>
                <p className="text-gray-800 mb-10 leading-relaxed text-lg">
                  PackTok helps packaging companies recover value from
                  underutilized machinery and surplus equipment. We conduct
                  detailed audits and ensure compliance, turning idle inventory
                  into capital while optimizing operational efficiency.
                </p>
                <Button className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg">
                  Request
                </Button>
              </div>
            </div>
          </section>

          {/* Investment and Takeover Section */}
          <section className="grid grid-cols-1 md:grid-cols-5 py-18">
            <Image
              src="/business-strategy-hexagonal-network-overlay-invest.png"
              alt="Investment and Takeover projects"
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
                  Investment and Takeover
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
                <Button
                  asChild
                  className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg"
                >
                  <Link href="/services/investment-and-takeover">Request</Link>
                </Button>
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
                  Machinery Installer
                </h2>
                <p className="text-sm uppercase tracking-widest mb-8 text-center font-semibold">
                  Asset Liquidation & Value Recovery
                </p>
                <p className="text-gray-800 mb-10 leading-relaxed text-lg">
                  PackTok bridges skilled professionals and leading employers in
                  the packaging industry. For job seekers, we offer tailored
                  listings and career insights to match your expertise with
                  ideal roles. For employers, we provide access to a qualified
                  talent pool, helping you find the right candidates to drive
                  your business forward. Together, we build stronger packaging
                  teams for a successful future.
                </p>
                <Button className="bg-black text-white hover:bg-gray-800 px-10 py-6 rounded-none font-bold w-fit text-lg shadow-lg">
                  Request
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}
