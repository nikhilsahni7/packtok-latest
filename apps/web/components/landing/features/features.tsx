import features1 from "@/assets/features1.png";
import features2 from "@/assets/features2.png";
import features3 from "@/assets/features3.png";
import features4 from "@/assets/features4.png";
import bidding from "@/assets/bidding.jpg";
import {
  ChevronRight,
  MoveRight,
} from "lucide-react";
import Image from "next/image";

const GridSection = () => {
  // Sample data for the main grid items
  const mainGridItems = [
    {
      id: 1,
      heading: "Turnkey Projects",
      image: features1,
    },
    {
      id: 2,
      heading: "Maintainance & Servicing",
      image: features2,
    },
    {
      id: 3,
      heading: "Consultancy Services",
      image: features3,
    },
    {
      id: 4,
      heading: "Sell Old Machinery",
      image: features4,
    },
  ];

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 
     sm:py-12 space-y-8 sm:space-y-12"
    >
      {/* Main Grid - 4 squares with images and text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {mainGridItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 rounded-lg p-4 sm:p-6 md:p-6 grid grid-cols-1 md:grid-cols-2 transition-all duration-300 hover:shadow-lg hover:bg-gray-50"
          >
            {/* Text content */}
            <div className="flex flex-col justify-end w-full text-left mt-4">
              <h3
                className="text-xl sm:text-2xl md:text-3xl
     text-gray-900 mb-4 leading-tight font-semibold"
              >
                {item.heading}
              </h3>
              <div className="flex items-center justify-center cursor-pointer group border-b-2 border-black w-fit">
                <span className="text-sm sm:text-base font-medium">
                  See more
                </span>
                <ChevronRight
                  className="ml-1 h-4 w-4 sm:h-5 sm:w-5 
     transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>

            {/* Image at top for all screen sizes */}
            <div className="flex-shrink-0 w-full overflow-hidden">
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

      {/* Full card at bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Image
          src={bidding}
          alt="Bidding Image"
          height={225}
          width={400}
          className="h-auto object-cover w-full mx-auto"
        />

        <div className="flex flex-col justify-center gap-4 px-16 py-8 bg-[#F3F5F7]">
          <h1 className="text-4xl font-medium">Bidding</h1>
          <p className="text-lg">
            Welcome to our Bidding Section – your gateway to exclusive deals and competitive offers. Participate in live auctions, place your bids with confidence, and grab the best prices on a wide range of products. Stay alert, bid smart, and win big with every opportunity. Let the bidding begin!
          </p>
          <button className="border-b-2 border-black w-fit py-1 cursor-pointer">Bid Now <MoveRight className="inline-block" /></button>
        </div>
      </div>
    </div>
  );
};

export default GridSection;
