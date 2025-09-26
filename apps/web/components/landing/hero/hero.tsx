import HeroCarousel from "./hero-carousel";

export default function Hero() {
  return (
    <section className="noise">
      <HeroCarousel />
      <div className="flex md:flex-row flex-col justify-between items-center py-4 sm:py-6 md:py-8 w-[95%] sm:w-[90%] md:w-[80%] mx-auto">
        <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-medium md:leading-tight sm:leading-snug leading-tight md:w-auto w-full mb-4 md:mb-0">
          Built for Industry, <br /> Backed by Expertise.
        </h1>
        <p className="text-gray-500 w-[400px] text-sm sm:text-base hyphens-auto text-justify font-normal">
          <span className="font-bold md:w-auto w-full hyphens-auto">
            PackTok
          </span>{" "}
          is well-known for sourcing and selling used and new corrugated packaging and converting equipment's across the globe. With over 35 years of
          experience, we&apos;re recognized as a trusted leader in the industry.
        </p>
      </div>
    </section>
  );
}
