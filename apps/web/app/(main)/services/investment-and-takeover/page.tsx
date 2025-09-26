'use client'
// import ChennaiImg from "@/assets/chennai.jpg";
import Chimneys from "@/assets/chimneys.png";
// import DelhiImg from "@/assets/delhi.jpg";
import Icon1 from "@/assets/icon1.svg";
import Icon2 from "@/assets/icon2.svg";
import Icon3 from "@/assets/icon3.jpg";
import WhoWeAre1 from "@/assets/investment-experts1.png";
import WhoWeAre2 from "@/assets/investment-experts2.png";
import WhoWeAre3 from "@/assets/investment-experts3.png";
// import KolkataImg from "@/assets/kolkata.jpg";
import Main from "@/assets/main.png";
// import MumbaiImg from "@/assets/mumbai.jpg";
// import PunjabImg from "@/assets/punjab.jpg";
import SocialIcons from "@/assets/social_icons.png";
import { CtaBanner as WebCtaBanner } from "@/components";
import { House, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const facilities = new Array(6).fill(0).map((_, i) => ({
  id: i,
  title: [
    "Heavy Machine Manufacturing Plant",
    "Food Processing Facility",
    "Automotive Components Factory",
  ][i % 3],
  city: "Mumbai, Maharashtra",
  image: Chimneys,
}));






// const neighborhoods = [
//   {
//     id: 1,
//     title: "Punjab",
//     count: 216,
//     span: "lg:col-span-5",
//     image: PunjabImg,
//   },
//   { id: 2, title: "Delhi", count: 141, span: "lg:col-span-5", image: DelhiImg },
//   {
//     id: 3,
//     title: "Mumbai",
//     count: 212,
//     span: "lg:col-span-5",
//     image: MumbaiImg,
//   },
//   {
//     id: 4,
//     title: "Chennai",
//     count: 183,
//     span: "lg:col-span-6",
//     image: ChennaiImg,
//   },
//   {
//     id: 5,
//     title: "Kolkata",
//     count: 112,
//     span: "lg:col-span-9",
//     image: KolkataImg,
//   },
// ];

export default function InvestmentAndTakeoverPage() {
  const [dataShow1, setDataShow1] = useState(false);
  const [dataShow2, setDataShow2] = useState(false);
  const [dataShow3, setDataShow3] = useState(false);

  const handlerbtn = () => {
    setDataShow1(true);
    setDataShow2(true);
    setDataShow3(false)
  }

  const handlerbtn1 = () => {
    setDataShow1(true);
     setDataShow2(false);
    setDataShow3(true);
  }

  return (
    <>
      <main className="mt-16 w-[95%] sm:w-[90%] md:w-[85%] mx-auto bg-[url('/circle-bg.png')] bg-contain bg-no-repeat">
        <div className="min-h-screen text-gray-900 py-8">
          {/* Hero */}
          <section className="p-8 overflow-hidden">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              FACTORY INVESTMENT & <br /> ACQUISITION PLATFORM
            </h1>
            <p className="mt-4 text-gray-600 max-w-3xl">
              Connecting factory owners with private investors and buyers —
              unlocking capital, facilitating acquisitions and maximizing
              intrinsic asset value through strategic partnerships.
            </p>
            <div className="py-8 grid md:grid-cols-2 gap-8 place-items-center">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={Main}
                  alt="hero"
                  width={800}
                  height={520}
                  className="object-cover w-full h-80 md:h-[400px]"
                />
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex gap-6 items-center px-8 py-4 rounded-xl shadow-lg bg-white max-w-sm">
                  <div className="icon">
                    <Image src={Icon1} alt="Valuation Icon" />
                  </div>
                  <div className="text">
                    <h4 className="text-base font-semibold">
                      Data-Driven Valuations
                    </h4>
                    <p className="text-base font-light">
                      Financial, operational & market potential analysis
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-center px-8 py-4 rounded-xl shadow-lg bg-white/40 max-w-sm">
                  <div className="icon">
                    <Image src={Icon2} alt="Deal Support Icon" />
                  </div>
                  <div className="text">
                    <h4 className="text-base font-semibold">
                      End-to-End Deal Support
                    </h4>
                    <p className="text-base font-light">
                      From due diligence to seamless transition
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8">
              <div className="flex gap-4 items-center px-8 py-6 rounded-full shadow-lg bg-white max-w-sm">
                <Image
                  src={SocialIcons}
                  alt="Social Icons"
                  className="h-8 shrink-0"
                />
                <div className="text">
                  <h4 className="text-lg font-medium">
                    7k+ Successful Transactions
                  </h4>
                </div>
              </div>

              <div className="flex gap-4 items-center px-8 py-6 rounded-full shadow-lg bg-white max-w-[320px]">
                <Image
                  src={Icon3}
                  alt="New Listings Icon"
                  className="size-8 rounded-full shrink-0"
                />
                <div className="text">
                  <h4 className="text-lg font-medium">
                    200+ New Listings Monthly!
                  </h4>
                </div>
              </div>
            </div>
          </section>

          {/* Who we are */}
          <section className="mt-16 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-sm text-indigo-500 font-semibold">
                WHO ARE WE
              </h3>
              <h2 className="text-4xl font-semibold mt-2">
                Factory Acquisition &amp; <br /> Investment Experts
              </h2>
              <p className="text-gray-600 mt-4 max-w-xl">
                Providing end-to-end solutions for factory acquisitions and
                investments, we match buyers with high-potential manufacturing
                assets through exclusive listings, thorough due diligence, and
                customized deal structures across all major packaging sectors.
              </p>

              <div className="mt-6 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="p-3 rounded-full aspect-square bg-black shadow">
                    <House className="size-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold pb-2">Exclusive Listings</h4>
                    <p className="text-base text-gray-800 font-light">
                      Access off-market and <br />
                      undervalued opportunities
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="p-3 rounded-full aspect-square bg-black shadow">
                    <SearchIcon className="size-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold pb-2">Enhanced Network</h4>
                    <p className="text-base text-gray-800 font-light">
                      Factories available across several <br /> locations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Image
                src={WhoWeAre1}
                alt="factory"
                width={400}
                height={300}
                className="object-cover w-full h-full rounded-2xl shadow-lg translate-y-8"
              />
              <div className="flex flex-col gap-4">
                <Image
                  src={WhoWeAre2}
                  alt="factory2"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full rounded-2xl shadow-lg"
                />
                <Image
                  src={WhoWeAre3}
                  alt="factory3"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </section>

          {/* Explore facilities */}
          <section className="mt-16 py-12">
            <div className="flex justify-between">
              <h3 className="pl-4 text-3xl font-semibold uppercase">
                EXPLORE PREMIUM INDUSTRIAL FACILITIES
              </h3>

              <div className="flex gap-4">
                <button onClick={handlerbtn} className="px-10 py-5 text-[2.3rem] rounded-full bg-black text-white">
                  Acquisition
                </button>
                <button onClick={handlerbtn1} className="px-10 py-5 text-[2.3rem] rounded-full border border-black text-black">
                  TakeOver
                </button>
              </div>
            </div>

            {dataShow1 ? "" : <p className="pl-4 text-gray-600 mt-2">
              Discover high-value manufacturing plants and
              warehouses—production-ready <br /> with turnkey operations for
              immediate acquisition.
            </p>}


            {dataShow2 ? <p className="pl-4 w-1/2 text-gray-600 mt-2">Through acquisitions, corrugated and packaging companies expand their reach and enhance production capacity.
              It creates opportunities for innovation, efficiency, and stronger customer solutions.</p> : ""}

            {dataShow3 ? <p className="pl-4 w-1/2 text-gray-600 mt-2">Takeovers in the packaging industry bring together strengths of two businesses.
This drives cost efficiency, wider market presence, and long-term growth.</p> : ""}

            <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {facilities.map((f) => (
                <article key={f.id} className="bg-white p-4">
                  {/* <div className="rounded-xl overflow-hidden"> */}
                  <Image
                    src={f.image}
                    alt={f.title}
                    width={340}
                    height={340}
                    className="object-cover w-full aspect-square rounded-xl"
                  />
                  {/* </div> */}
                  <h4 className="mt-3 font-semibold">{f.title}</h4>
                  <p className="text-sm text-gray-500">{f.city}</p>
                  <div className="mt-4">
                    <button className="px-4 py-2 bg-black text-white rounded">
                      Send Query
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* <div className="mt-12 text-center">
              <button className="px-6 py-2 border border-black rounded-full">
                Show more
              </button>
            </div> */}
          </section>

          {/* Neighborhoods */}
          {/* <section className="mt-4 py-12">
            <h3 className="text-lg text-indigo-500 font-normal uppercase">
              AREAS ACROSS THE TOWN
            </h3>
            <h2 className="text-4xl font-semibold mt-2">
              Neighborhood Factories
            </h2>

            <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-15 gap-8">
              {neighborhoods.map((n) => (
                <div
                  key={n.id}
                  className={`relative rounded-xl overflow-hidden shadow-lg ${n.span} h-[320px]`}
                >
                  <Image
                    src={n.image}
                    alt={n.title}
                    width={400}
                    height={260}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div>
                      <div className="text-5xl font-semibold text-white">
                        {n.count}
                      </div>
                      <div className="text-lg text-white">{n.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section> */}
        </div>

        {/* Banner */}
      </main>
      <WebCtaBanner href="/services/investment-and-takeover/form" />
    </>
  );
}
