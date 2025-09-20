import {
  Features,
  Hero,
  NewArrivals,
  Newsletter,
  ShopNow,
  Articles
} from "@/components";

import "/styles/globals.css";


export default function Home() {
  return (
    <main className="mt-16 fluid-bg">
      <Hero />
      <ShopNow />
      <NewArrivals />
      <Features />
      <Articles />
      <Newsletter />
    </main>
  );
}
