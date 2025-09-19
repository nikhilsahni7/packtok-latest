import HeroCarousel from "./hero-carousel";

export default function Hero() {
  return (
    <section className="noise mt-12">
      <HeroCarousel />
      <div className="flex md:flex-row flex-col justify-between items-center py-4 sm:py-6 md:py-8 w-[95%] sm:w-[90%] md:w-[80%] mx-auto">
        <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-medium md:leading-tight sm:leading-snug leading-tight md:w-auto w-full mb-4 md:mb-0">
          Built for Industry, <br /> Backed by Expertise.
        </h1>
        <p className="text-gray-500 text-sm sm:text-base font-normal">
          <span className="font-bold md:w-auto w-full">PackTok</span> is
          specialized in factory machinery, spare parts, and{" "}
          <br className="hidden sm:inline" />
          industrial maintenance{" "}
          <span className="md:inline hidden">
            - trusted by manufacturers for <br /> reliable performance and
            expert support.
          </span>
        </p>
      </div>
    </section>
  );
}
