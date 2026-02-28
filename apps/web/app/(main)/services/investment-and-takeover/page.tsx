
// import ChennaiImg from "@/assets/chennai.jpg";
// import DelhiImg from "@/assets/delhi.jpg";
import Icon1 from "@/assets/icon1.svg";
import Icon2 from "@/assets/icon2.svg";
import Icon3 from "@/assets/icon3.jpg";
import WhoWeAre1 from "@/assets/investment-experts1.png";
import WhoWeAre2 from "@/assets/investment-experts2.png";
import WhoWeAre3 from "@/assets/investment-experts3.png";
// import KolkataImg from "@/assets/kolkata.jpg";
import Main from "@/assets/factory-Acquire.jpg";
import merger from "@/assets/merger and acquisitaion.jpg";
import Takeover from "@/assets/Takeover.jpeg";


// import MumbaiImg from "@/assets/mumbai.jpg";
// import PunjabImg from "@/assets/punjab.jpg";
import SocialIcons from "@/assets/social_icons.png";
import { CtaBanner as WebCtaBanner } from "@/components";
import { House, SearchIcon } from "lucide-react";



import Image from "next/image";
import FacilitiesSection from "./components/FacilitiesSection";







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


  return (
    <>
      <main className="mt-16 w-[95%] sm:w-[90%] md:w-[85%] mx-auto bg-[url('/circle-bg.png')] bg-contain bg-no-repeat">
        <div className="min-h-screen text-gray-900 py-8">
          {/* Hero */}
          <section className="p-8 overflow-hidden">
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight md:leading-16">
              FACTORY  ACQUISITION  <br />  TAKEOVER  PLATFORM
            </h1>
            <p className="mt-4 text-gray-600 text-justify max-w-3xl">
              Connecting factory owners with private investors and buyers —
              unlocking capital, facilitating acquisitions and maximizing
              intrinsic asset value through strategic partnerships.
            </p>
            <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
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

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
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
          <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-sm text-indigo-500 font-semibold">
                WHO ARE WE
              </h3>
              <h2 className="text-4xl font-semibold mt-2">
                Factory Acquisition &amp; <br /> Investment Experts
              </h2>
              <p className="text-gray-600 text-justify mt-4 max-w-xl">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Image
                src={WhoWeAre1}
                alt="factory"
                width={400}
                height={300}
                className="object-cover w-full h-full rounded-2xl shadow-lg md:translate-y-8"
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


            {/* merger and acquisitaion.jpg */}

            <h3 className="text-3xl md:text-[3rem] font-semibold uppercase">
              Acquisition
            </h3>
            <div className="grid py-10 md:py-20 grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <Image
                  src={merger}
                  alt="Acquisition"
                  className="rounded-[1rem]"
                />
              </div>
              <div className="pl-4 text-lg md:text-[1.5rem] text-justify text-gray-600 mt-2"> <ul>
                <li className="list-disc">At Packtok, acquisition refers to a business transaction where one company purchases a majority or all of another {"company's"} shares or assets, gaining full control.</li>
                <li className="py-4 list-disc">The purpose is to integrate the target {"company's"} operations, resources, or market presence into the acquiring company.</li>
                <li className="list-disc">This process helps businesses expand market share, improve efficiencies, and explore.</li>
              </ul></div>
            </div>

            <h3 className="text-3xl md:text-[3rem] font-semibold uppercase">
              Takeover
            </h3>

            <div className="grid py-10 md:py-20 grid-cols-1 sm:grid-cols-2 gap-5">

              <div className="pl-4 text-lg md:text-[1.5rem] text-justify text-gray-600 mt-2">

                <ul>
                  <li className="list-disc">At Packtok, a takeover refers to the process where one company the acquirer gains control or ownership of another company the target by purchasing a significant portion of its shares or assets. </li>
                  <li className="py-4 list-disc"> This can happen through a friendly agreement with the {"target's"} board and shareholders or through a direct bid to shareholders.</li>
                  <li className="py-4 list-disc">Takeovers are a common strategy for external growth, helping businesses expand their reach, resources, and market presence.</li>
                </ul>
              </div>

              <div>
                <Image
                  src={Takeover}
                  alt="Takeover"
                  className="rounded-[1rem] w-3/4 mx-auto"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <h3 className="pl-4 text-2xl md:text-3xl font-semibold uppercase">
                EXPLORE PREMIUM INDUSTRIAL FACILITIES
              </h3>


            </div>

            <p className="pl-4 text-justify text-gray-600 mt-2">
              Discover high-value manufacturing plants and
              warehouses—production-ready <br className="hidden md:block"/> with turnkey operations for
              immediate acquisition.
            </p>


            <FacilitiesSection />


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

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 grid-cols-1 md:grid-cols-3 lg:grid-cols-15 gap-8">
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
