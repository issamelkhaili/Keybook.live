"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Featured games for hero slider
const featuredGames = [
  {
    id: 1,
    title: "Payday 3",
    image: "https://ext.same-assets.com/3953624285/3987804214.jpeg",
    href: "/buy-payday-3-standard-cd-key-steam-global",
  },
  {
    id: 2,
    title: "Spider-Man Remastered",
    image: "https://ext.same-assets.com/3953624285/2412204598.jpeg",
    href: "/buy-marvel-s-spider-man-remastered-cd-key-steam",
  },
  {
    id: 3,
    title: "Resident Evil 4 Remake",
    image: "https://ext.same-assets.com/3953624285/4145879959.jpeg",
    href: "/buy-resident-evil-4-remake-cd-key-steam",
  },
];

// Featured products
const featuredProducts = [
  {
    id: 1,
    title: "Star Wars Jedi: Survivor",
    image: "/images/star-wars.jpg",
    price: "$17.43",
    rating: 5,
    inStock: true,
    href: "/buy-star-wars-jedi-survivor-origin",
  },
  {
    id: 2,
    title: "Kingdom Come: Deliverance II",
    image: "/images/kingdom-come.jpg",
    price: "$49.70",
    rating: 5,
    inStock: true,
    href: "/buy-kingdom-come-deliverance-ii-cd-key-steam",
  },
  {
    id: 3,
    title: "Hogwarts Legacy",
    image: "/images/hogwarts.jpg",
    price: "$19.74",
    rating: 5,
    inStock: true,
    href: "/buy-hogwarts-legacy-cd-key-steam",
  },
  {
    id: 4,
    title: "Cities: Skylines II",
    image: "/images/cities-skylines.jpg",
    price: "$18.86",
    rating: 5,
    inStock: true,
    href: "/buy-cities-skylines-ii-cd-key-steam-global",
  },
];

// Software products
const softwareProducts = [
  {
    id: 1,
    title: "Microsoft Office 365 Personal",
    image: "/images/office-365.jpg",
    price: "$55.58",
    rating: 5,
    inStock: true,
    href: "/buy-office-365-personal-user-1-year-1",
  },
  {
    id: 2,
    title: "CCleaner Professional 1 Year",
    image: "/images/ccleaner.jpg",
    price: "$10.00",
    rating: 5,
    inStock: true,
    href: "/buy-ccleaner-professional-1-year-1-dev-cd-key-global",
  },
  {
    id: 3,
    title: "VMware Workstation 17.5 Pro",
    image: "/images/vmware.jpg",
    price: "$8.90",
    rating: 5,
    inStock: true,
    href: "/buy-vmware-workstation-17-5-pro-lifetime-license-cd-key-global",
  },
  {
    id: 4,
    title: "Windows 11 Pro",
    image: "/images/windows-11.jpg",
    price: "$4.99",
    rating: 5,
    inStock: true,
    href: "/buy-windows-11-pro-cd-key-oem-microsoft-global-1",
  },
];

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
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate the slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
  };

  return (
    <>
      {/* Hero slider */}
      <div className="relative overflow-hidden bg-black h-[300px] md:h-[400px]">
        <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {featuredGames.map((game, index) => (
            <div key={game.id} className="min-w-full relative">
              <Link href={game.href}>
                <div className="w-full h-[300px] md:h-[400px] relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
                  {/* We're using div with background image as a fallback since we don't have actual images yet */}
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${game.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h2 className="text-2xl md:text-4xl font-bold">{game.title}</h2>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Slider controls */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 z-10"
          onClick={prevSlide}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 z-10"
          onClick={nextSlide}
        >
          <ChevronRight />
        </Button>

        {/* Slider indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredGames.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? "bg-primary" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </div>

      {/* Featured Game Products */}
      <section className="py-10 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Marketing Text */}
      <section className="py-10 bg-slate-950 text-slate-300">
        <div className="container mx-auto px-4">
          <p className="text-center max-w-4xl mx-auto">
            Gamers-Outlet.net is a place that offers digital codes for games, software and much more at the best prices possible, at the click of a button! We pride ourselves in delivering digital codes instantly, and hassle-free. Simply purchase a code for a game or software of your choice and redeem it on any major platform such as Steam, Uplay, Origin, Battle.net, Playstation or the Windows Store; almost instantaneously! Reliable and trustworthy, we're always here to take care of your software or gaming needs! Make sure to check out our homepage for regular updates and to view our bestsellers for the month and visit our blog for cool insights and reviews of anything related to the gaming industry! Happy surfing!
          </p>
        </div>
      </section>

      {/* Featured Software Products */}
      <section className="py-10 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">FEATURED</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {softwareProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Partner Badges */}
      <section className="py-6 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-8">
            {partnerBadges.map((badge) => (
              <div key={badge.id} className="w-32 h-12 relative">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${badge.image})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Link Banner */}
      <section className="py-4 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Link href="/reviews" className="text-white hover:underline font-medium">
              READ 1,900+ REVIEWS &gt;&gt;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Product Card Component
function ProductCard({ product }: { product: any }) {
  return (
    <Card className="product-card bg-slate-800 border-slate-700 overflow-hidden">
      <Link href={product.href}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${product.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          {/* Stock label */}
          <div className={`absolute top-2 left-2 ${product.inStock ? "in-stock" : "out-of-stock"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        {/* Rating */}
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>

        {/* Title */}
        <Link href={product.href}>
          <h3 className="text-sm text-white font-medium hover:text-primary transition-colors line-clamp-2 h-10">
            {product.title}
          </h3>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="product-price">{product.price}</span>
        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
          BUY NOW
        </Button>
      </CardFooter>
    </Card>
  );
}
