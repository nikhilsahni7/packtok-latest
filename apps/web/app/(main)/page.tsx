import {
  Articles,
  Features,
  Hero,
  NewArrivals,
  Newsletter,
  ShopNow,
} from "@/components";
import PodcastsSection from "@/components/landing/podcasts/podcasts-section";

export default function Home() {
  return (
    <main className="fluid-bg">
      <Hero />
      <ShopNow />
      <NewArrivals />
      <Features />
      <PodcastsSection />
      <Articles />
      <Newsletter />
    </main>
  );
}
