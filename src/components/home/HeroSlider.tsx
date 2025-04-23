import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FeaturedGame {
  id: number;
  title: string;
  image: string;
  href: string;
}

interface HeroSliderProps {
  games: FeaturedGame[];
}

export function HeroSlider({ games }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate the slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % games.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [games.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % games.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + games.length) % games.length);
  };

  return (
    <div className="relative overflow-hidden bg-black h-[300px] md:h-[400px]">
      <div 
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {games.map((game) => (
          <div key={game.id} className="min-w-full relative">
            <Link href={game.href}>
              <div className="w-full h-[300px] md:h-[400px] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
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
        {games.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
} 