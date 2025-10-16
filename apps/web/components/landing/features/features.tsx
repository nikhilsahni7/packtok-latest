import bidding from "@/assets/bidding1.webp";
import features3 from "@/assets/feature-consultancy.png";
import features5 from "@/assets/Mechanics.png";
import features6 from "@/assets/feature-investment.png";
import features4 from "@/assets/feature-machinery.png";
import features2 from "@/assets/feature-services.png";
import features1 from "@/assets/feature-turnkey.png";
import { ChevronRight, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const GridSection = () => {
  // Sample data for the main grid items
  const mainGridItems = [
    {
      id: 1,
      heading: "Turnkey Projects",
      image: features1,
      href: "/services/turnkey-projects",
    },
    {
      id: 2,
      heading: "Maintainance & Servicing",
      image: features2,
      href: "/services/maintenance",
    },
    {
      id: 3,
      heading: "Consultancy Services",
      image: features3,
      href: "/services/consultancy",
    },
    {
      id: 4,
      heading: "Sell Old Machinery",
      image: features4,
      href: "/services/sell-old-items",
    },
    {
      id: 5,
      heading: "Maintainance Crew",
      image: features5,
      href: "/services/machinery-installer",
    },
    {
      id: 6,
      heading: "Acquisition Takeover",
      image: features6,
      href: "/services/investment-and-takeover",
    },
  ];

  return (
    <div
      className="w-full md:w-[80%] mx-auto py-8
     sm:py-12 space-y-8 sm:space-y-12"
    >
      {/* Main Grid - 4 squares with images and text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {mainGridItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 rounded-lg p-4 sm:p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 transition-all duration-300 hover:shadow-lg  h-[318px]"
          >
            {/* Text content */}
            <div className="flex flex-col justify-end w-full text-left mt-4">
              <h3
                className="text-xl sm:text-2xl md:text-[2.125rem] 
     text-gray-900 mb-4 leading-tight font-medium w-[200px]"
              >
                {item.heading}
              </h3>
              <Link
                href={item.href || "#"}
                className="flex items-center justify-center cursor-pointer group border-b-2 border-black w-fit"
              >
                <span className="text-sm sm:text-base font-medium">
                  See more
                </span>
                <ChevronRight
                  className="ml-1 h-4 w-4 sm:h-5 sm:w-5
     transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Image at top for all screen sizes */}
            <div className="flex-shrink-0 w-full overflow-hidden flex items-center">
              <Image
                src={item.image}
                alt={item.heading}
                height={225}
                width={400}
              // className="w-[90%] sm:w-[80%] md:w-[75%] lg:w-[70%] xl:w-[65%] h-auto object-contain mx-auto"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="h-4"></div>

      {/* Full card at bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-12">
        <Image
          src={bidding}
          alt="Bidding Image"
          height={225}
          width={400}
          className="h-auto object-cover w-full mx-auto"
        />

        <div className="flex flex-col justify-center gap-4 px-16 py-8 bg-[#F3F5F7]">
          <h1 className="text-[40px] font-medium">Bidding for Packagers</h1>
          <p className="text-lg text-justify ">
            Welcome to our Bidding Section – your gateway to exclusive deals and
            competitive offers. Participate in live auctions, place your bids
            with confidence, and grab the best prices on a wide range of
            products. Stay alert, bid smart, and win big with every opportunity.
            Let the bidding begin!
          </p>
          <Link
            href="/bidding"
            className="border-b-2 border-black w-fit py-1 cursor-pointer"
          >
            Bid Now <MoveRight className="inline-block" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GridSection;
