"use client";

import { HeroSlider } from "@/components/home/HeroSlider";
import { ProductSection } from "@/components/home/ProductSection";
import { featuredGames } from "@/data/featured-games";
import { featuredProducts, softwareProducts } from "@/data/products";

// Partner badges
const partnerBadges = [
  {
    id: 1,
    name: "CDKeyDeals",
    image: "https://ext.same-assets.com/3953624285/2870086.png",
  },
  {
    id: 2,
    name: "Trusted Partner",
    image: "https://ext.same-assets.com/3824927836/2870086.png",
  },
  {
    id: 3,
    name: "Elite Member",
    image: "https://ext.same-assets.com/3893671847/2870086.png",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero slider */}
      <HeroSlider games={featuredGames} />

      {/* Partner badges */}
      <div className="bg-slate-900 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-6">
            {partnerBadges.map((badge) => (
              <div key={badge.id}>
                <img
                  src={badge.image}
                  alt={badge.name}
                  className="h-14 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Games Section */}
      <ProductSection
        title="Featured Games"
        viewAllLink="/games"
        products={featuredProducts}
      />

      {/* Software Section */}
      <ProductSection
        title="Software"
        viewAllLink="/software"
        products={softwareProducts}
      />
    </>
  );
}
