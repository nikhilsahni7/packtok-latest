import { Button } from "@packtok/ui/components/button";
import Image from "next/image";
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
      <section className="bg-black py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center">
            Services
          </h1>
        </div>
      </section>

      {/* Services Container */}
      <div className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Turnkey Projects Section */}
          <section className="relative mb-32">
            <div className="relative flex items-center min-h-[500px]">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full opacity-20 translate-x-32 -translate-y-32"></div>

              {/* Floating decorative icon */}
              <div className="absolute bottom-16 left-16 w-24 h-24 bg-black rounded-3xl flex items-center justify-center opacity-90 shadow-xl">
                <Image
                  src="/tunkery-icon.png"
                  alt="Turnkey icon"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
              </div>

              {/* Content Container */}
              <div className="relative w-full grid grid-cols-12 gap-8 items-center">
                {/* Left Image - 7 columns */}
                <div className="col-span-7 relative">
                  <Image
                    src="/tunkery.jpg"
                    alt="Turnkey projects"
                    width={700}
                    height={450}
                    className="w-full h-[450px] object-cover rounded-3xl shadow-2xl"
                  />
                </div>

                {/* Right Content - 5 columns overlapping */}
                <div className="col-span-5 -ml-16 relative z-20">
                  <div className="bg-black text-white p-12 rounded-3xl shadow-2xl min-h-[450px] flex flex-col justify-center">
                    <h2 className="text-5xl font-bold mb-6 text-white">
                      Turnkey projects
                    </h2>
                    <p className="text-sm uppercase tracking-widest mb-8 text-orange-300 font-semibold">
                      End-to-end turnkey project solutions
                    </p>
                    <p className="text-gray-300 mb-10 leading-relaxed text-lg">
                      Packtak offers end-to-end turnkey project solutions for
                      the packaging industry, managing everything from initial
                      planning and machinery sourcing to installation, testing,
                      and final handover. Our expert team ensures seamless
                      execution, timely delivery, and cost efficiency.
                    </p>
                    <Button className="bg-white text-black hover:bg-gray-100 px-10 py-4 font-bold rounded-xl w-fit text-lg shadow-lg">
                      Request
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Maintenance Section */}
          <section className="relative mb-32">
            <div className="relative flex items-center min-h-[500px]">
              {/* Background decorative elements */}
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-300 to-yellow-400 opacity-20 transform rotate-45 -translate-x-20 translate-y-20"></div>

              {/* Floating decorative icon */}
              <div className="absolute top-16 right-16 w-24 h-24 bg-black rounded-3xl flex items-center justify-center opacity-90 shadow-xl">
                <Image
                  src="/maintain-icon.png"
                  alt="Maintenance icon"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
              </div>

              {/* Content Container */}
              <div className="relative w-full grid grid-cols-12 gap-8 items-center">
                {/* Left Content - 5 columns */}
                <div className="col-span-5 relative z-20">
                  <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 min-h-[450px] flex flex-col justify-center">
                    <h2 className="text-5xl font-bold mb-6 text-black">
                      Maintenance
                    </h2>
                    <p className="text-sm uppercase tracking-widest mb-8 text-orange-500 font-semibold">
                      Proactive maintenance solutions
                    </p>
                    <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                      Our comprehensive maintenance services ensure your
                      packaging equipment operates at peak performance. From
                      preventive maintenance schedules to emergency repairs, we
                      provide round-the-clock support to minimize downtime and
                      maximize productivity.
                    </p>
                    <Button className="bg-black text-white hover:bg-gray-800 px-10 py-4 font-bold rounded-xl w-fit text-lg shadow-lg">
                      Request
                    </Button>
                  </div>
                </div>

                {/* Right Image - 7 columns overlapping */}
                <div className="col-span-7 -ml-16 relative">
                  <Image
                    src="/maintenace.png"
                    alt="Maintenance services"
                    width={700}
                    height={450}
                    className="w-full h-[450px] object-cover rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Consultancy Section */}
          <section className="relative mb-32">
            <div className="relative flex items-center min-h-[500px]">
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full opacity-15 -translate-x-32 -translate-y-32"></div>

              {/* Floating decorative icon */}
              <div className="absolute bottom-16 left-16 w-24 h-24 bg-black rounded-3xl flex items-center justify-center opacity-90 shadow-xl">
                <Image
                  src="/consult-icon.png"
                  alt="Consultancy icon"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
              </div>

              {/* Content Container */}
              <div className="relative w-full grid grid-cols-12 gap-8 items-center">
                {/* Left Image - 7 columns */}
                <div className="col-span-7 relative">
                  <Image
                    src="/consult.png"
                    alt="Consultancy services"
                    width={700}
                    height={450}
                    className="w-full h-[450px] object-cover rounded-3xl shadow-2xl"
                  />
                </div>

                {/* Right Content - 5 columns overlapping */}
                <div className="col-span-5 -ml-16 relative z-20">
                  <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 min-h-[450px] flex flex-col justify-center">
                    <h2 className="text-5xl font-bold mb-6 text-black">
                      Consultancy
                    </h2>
                    <p className="text-sm uppercase tracking-widest mb-8 text-purple-500 font-semibold">
                      PackTok&apos;s expert consultancy
                    </p>
                    <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                      Packtak offers specialized consultancy services for the
                      packaging industry, delivering strategic guidance to
                      optimize operational efficiency. From process
                      optimization, cost reduction, to sustainable business
                      optimization and consulting solutions.
                    </p>
                    <Button className="bg-black text-white hover:bg-gray-800 px-10 py-4 font-bold rounded-xl w-fit text-lg shadow-lg">
                      Request
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Buy & Sell Machinery Section */}
          <section className="relative mb-32">
            <div className="relative flex items-center min-h-[500px]">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400 rounded-full opacity-15 translate-x-36 -translate-y-36"></div>

              {/* Floating decorative icon */}
              <div className="absolute bottom-16 right-16 w-24 h-24 bg-black rounded-3xl flex items-center justify-center opacity-90 shadow-xl">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                </svg>
              </div>

              {/* Content Container */}
              <div className="relative w-full grid grid-cols-12 gap-8 items-center">
                {/* Left Content - 5 columns */}
                <div className="col-span-5 relative z-20">
                  <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 min-h-[450px] flex flex-col justify-center">
                    <h2 className="text-5xl font-bold mb-6 text-black">
                      Buy & Sell Machinery
                    </h2>
                    <p className="text-sm uppercase tracking-widest mb-8 text-blue-500 font-semibold">
                      Asset Liquidation & Value Recovery
                    </p>
                    <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                      PackTok helps packaging companies recover value from
                      underutilized machinery and surplus equipment. We conduct
                      detailed audits and ensure compliance, turning idle
                      inventory into capital while optimizing operational
                      efficiency.
                    </p>
                    <Button className="bg-black text-white hover:bg-gray-800 px-10 py-4 font-bold rounded-xl w-fit text-lg shadow-lg">
                      Request
                    </Button>
                  </div>
                </div>

                {/* Right Image - 7 columns overlapping */}
                <div className="col-span-7 -ml-16 relative">
                  <Image
                    src="/buy-sell.jpg"
                    alt="Industrial machinery"
                    width={700}
                    height={450}
                    className="w-full h-[450px] object-cover rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Investment and Takeover Section */}
          <section className="relative mb-32">
            <div className="relative flex items-center min-h-[500px]">
              {/* Background decorative elements */}
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400 rounded-full opacity-15 -translate-x-32 translate-y-32"></div>
              <div className="absolute top-20 right-20 w-32 h-32 bg-green-400 rounded-full opacity-20"></div>

              {/* Floating decorative icon */}
              <div className="absolute bottom-16 left-16 w-24 h-24 bg-black rounded-3xl flex items-center justify-center opacity-90 shadow-xl">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                </svg>
              </div>

              {/* Content Container */}
              <div className="relative w-full grid grid-cols-12 gap-8 items-center">
                {/* Left Image - 7 columns */}
                <div className="col-span-7 relative">
                  <Image
                    src="/business-strategy-hexagonal-network-overlay-invest.png"
                    alt="Investment and takeover"
                    width={700}
                    height={450}
                    className="w-full h-[450px] object-cover rounded-3xl shadow-2xl"
                  />
                </div>

                {/* Right Content - 5 columns overlapping */}
                <div className="col-span-5 -ml-16 relative z-20">
                  <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 min-h-[450px] flex flex-col justify-center">
                    <h2 className="text-5xl font-bold mb-6 text-black">
                      Investment and Takeover
                    </h2>
                    <p className="text-sm uppercase tracking-widest mb-8 text-green-500 font-semibold">
                      Investment & Acquisition Solutions
                    </p>
                    <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                      Strategic investment and acquisition services for
                      packaging companies looking to expand or optimize their
                      operations. We provide comprehensive due diligence,
                      valuation, and transaction support for successful business
                      transformations.
                    </p>
                    <Button className="bg-black text-white hover:bg-gray-800 px-10 py-4 font-bold rounded-xl w-fit text-lg shadow-lg">
                      Request
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Finder Section */}
          <section className="relative mb-20">
            <div className="relative flex items-center min-h-[500px]">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-yellow-400 opacity-15 transform rotate-12 translate-x-28 -translate-y-28"></div>

              {/* Floating decorative icon */}
              <div className="absolute top-16 right-16 w-24 h-24 bg-black rounded-3xl flex items-center justify-center opacity-90 shadow-xl">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 4C16.55 4 17 4.45 17 5V7H20C20.55 7 21 7.45 21 8V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V8C3 7.45 3.45 7 4 7H7V5C7 4.45 7.45 4 8 4H16M9 5V7H15V5H9Z" />
                </svg>
              </div>

              {/* Content Container */}
              <div className="relative w-full grid grid-cols-12 gap-8 items-center">
                {/* Left Content - 5 columns */}
                <div className="col-span-5 relative z-20">
                  <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 min-h-[450px] flex flex-col justify-center">
                    <h2 className="text-5xl font-bold mb-6 text-black">
                      Job Finder
                    </h2>
                    <p className="text-sm uppercase tracking-widest mb-8 text-yellow-600 font-semibold">
                      Talent & Career Opportunities
                    </p>
                    <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                      Connect with top talent and career opportunities in the
                      industrial sector. Our job finder platform bridges the gap
                      between skilled professionals and leading companies,
                      facilitating successful placements and career advancement.
                    </p>
                    <Button className="bg-black text-white hover:bg-gray-800 px-10 py-4 font-bold rounded-xl w-fit text-lg shadow-lg">
                      Request
                    </Button>
                  </div>
                </div>

                {/* Right Image - 7 columns overlapping */}
                <div className="col-span-7 -ml-16 relative">
                  <Image
                    src="/jobfinder.png"
                    alt="Job finder platform"
                    width={700}
                    height={450}
                    className="w-full h-[450px] object-cover rounded-3xl shadow-2xl"
                  />
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
