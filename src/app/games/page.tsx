"use client";

import { useState } from "react";
import Link from "next/link";
import { Grid, List, ChevronRight, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Game categories
const gameCategories = [
  { name: "Credit", count: 26, href: "/games/credit" },
  { name: "Recommended", count: 69, href: "/games/recommended" },
  { name: "Action Games", count: 1382, href: "/games/action-games" },
  { name: "Adventure Games", count: 1535, href: "/games/action-adventure-games" },
  { name: "Battle arena Games", count: 22, href: "/games/battle-arena-games" },
  { name: "Battle royale Games", count: 18, href: "/games/battle-royale-games" },
  { name: "Fighting Games", count: 726, href: "/games/fighting-games" },
  { name: "Massively multiplayer online Games", count: 185, href: "/games/massively-multiplayer-online-games" },
  { name: "Platformer Games", count: 236, href: "/games/platformer-games" },
  { name: "Puzzle Games", count: 201, href: "/games/puzzle-games" },
  { name: "Racing Games", count: 182, href: "/games/racing-games" },
  { name: "Role-playing Games", count: 839, href: "/games/role-playing-games" },
  { name: "Sandbox Games", count: 15, href: "/games/sandbox-games" },
  { name: "Shooter Games", count: 950, href: "/games/shooter-games" },
  { name: "Simulation Games", count: 736, href: "/games/simulation-games" },
  { name: "Sports Games", count: 258, href: "/games/sports-games" },
  { name: "Strategy Games", count: 1011, href: "/games/strategy-games" },
  { name: "Survival horror Games", count: 171, href: "/games/survival-horror-games" },
  { name: "Subscription", count: 17, href: "/games/subscription" },
];

// Sample game products
const gameProducts = [
  {
    id: 1,
    title: "Kingdom Come Deliverance II Cd Key Steam Global",
    image: "https://ext.same-assets.com/3953624285/2412204598.jpeg",
    price: "$42.91",
    rating: 5,
    inStock: true,
    href: "/product/kingdom-come-deliverance-ii",
  },
  {
    id: 2,
    title: "Buy Random Steam Key Cd Key Global",
    image: "https://ext.same-assets.com/3953624285/3987804214.jpeg",
    price: "$1.73",
    rating: 5,
    inStock: true,
    href: "/product/random-steam-key",
  },
  {
    id: 3,
    title: "Street Fighter 6 Cd Key Steam ROW",
    image: "https://ext.same-assets.com/3953624285/4145879959.jpeg",
    price: "$19.58",
    rating: 5,
    inStock: false,
    href: "/product/street-fighter-6",
  },
  {
    id: 4,
    title: "Hearts of Iron IV Cd Key Steam DE",
    image: "https://ext.same-assets.com/3953624285/3987804214.jpeg",
    price: "$7.19",
    rating: 5,
    inStock: true,
    href: "/product/hearts-of-iron-iv",
  },
  {
    id: 5,
    title: "XBOX Game Pass Ultimate - 3 Month Cd Key",
    image: "https://ext.same-assets.com/3953624285/2412204598.jpeg",
    price: "$39.84",
    rating: 5,
    inStock: true,
    href: "/product/xbox-game-pass-ultimate",
  },
  {
    id: 6,
    title: "Cities: Skylines II Cd Key Steam Global",
    image: "https://ext.same-assets.com/3953624285/4145879959.jpeg",
    price: "$16.28",
    rating: 5,
    inStock: true,
    href: "/product/cities-skylines-ii",
  },
  {
    id: 7,
    title: "Age of Empires: Definitive Edition Cd Key Steam GLOBAL",
    image: "https://ext.same-assets.com/3953624285/3987804214.jpeg",
    price: "$2.88",
    rating: 5,
    inStock: true,
    href: "/product/age-of-empires",
  },
  {
    id: 8,
    title: "Xbox Game Pass Ultimate - 1 Month Europe XBOX Windows",
    image: "https://ext.same-assets.com/3953624285/2412204598.jpeg",
    price: "$13.89",
    rating: 5,
    inStock: true,
    href: "/product/xbox-game-pass-ultimate-1-month",
  },
  {
    id: 9,
    title: "Xbox Game Pass PC - 3 Month Cd Key Europe",
    image: "https://ext.same-assets.com/3953624285/4145879959.jpeg",
    price: "$22.08",
    rating: 5,
    inStock: true,
    href: "/product/xbox-game-pass-pc-3-month",
  },
  {
    id: 10,
    title: "Total War Warhammer II Cd Key Steam Europe",
    image: "https://ext.same-assets.com/3953624285/3987804214.jpeg",
    price: "$8.22",
    rating: 5,
    inStock: true,
    href: "/product/total-war-warhammer-ii",
  },
  {
    id: 11,
    title: "Spiritfarer Farewell Edition Cd Key Steam Global",
    image: "https://ext.same-assets.com/3953624285/2412204598.jpeg",
    price: "$2.93",
    rating: 5,
    inStock: true,
    href: "/product/spiritfarer",
  },
  {
    id: 12,
    title: "GTA V Premium Online Edition & GREAT WHITE SHARK",
    image: "https://ext.same-assets.com/3953624285/4145879959.jpeg",
    price: "$12.48",
    rating: 5,
    inStock: true,
    href: "/product/gta-v-premium",
  },
];

// Sort options
const sortOptions = [
  { value: "default", label: "Default" },
  { value: "name-asc", label: "Name (A - Z)" },
  { value: "name-desc", label: "Name (Z - A)" },
  { value: "price-asc", label: "Price (Low > High)" },
  { value: "price-desc", label: "Price (High > Low)" },
  { value: "rating-desc", label: "Rating (Highest)" },
  { value: "rating-asc", label: "Rating (Lowest)" },
  { value: "bestsellers", label: "Best Sellers" },
];

// Display count options
const displayOptions = [
  { value: 12, label: "12" },
  { value: 24, label: "24" },
  { value: 28, label: "28" },
  { value: 32, label: "32" },
  { value: 40, label: "40" },
];

export default function GamesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("default");
  const [displayCount, setDisplayCount] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(true);

  const toggleCategoriesView = () => {
    setExpandedCategories(!expandedCategories);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleDisplayCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayCount(Number.parseInt(e.target.value));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on search term
  const filteredProducts = gameProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-8 text-slate-400">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-slate-200">Games</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">GAMES</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Refine Search</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={toggleCategoriesView}
                >
                  {expandedCategories ? "Hide" : "Show"}
                </Button>
              </div>

              {/* Categories list - collapsible on mobile */}
              <div className={`space-y-3 ${expandedCategories ? 'block' : 'hidden lg:block'}`}>
                {gameCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="flex justify-between text-slate-300 hover:text-primary transition-colors"
                  >
                    <span>{category.name}</span>
                    <span className="text-slate-500">({category.count})</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Search and filter controls */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-grow">
                  <Input
                    type="search"
                    placeholder="Search in games..."
                    className="bg-slate-700 border-slate-600 text-white pr-10"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    className={viewMode === "grid" ? "bg-primary text-white" : "border-slate-600 text-slate-300"}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid size={18} />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    className={viewMode === "list" ? "bg-primary text-white" : "border-slate-600 text-slate-300"}
                    onClick={() => setViewMode("list")}
                  >
                    <List size={18} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Sort By:</span>
                  <select
                    className="bg-slate-700 border-slate-600 rounded text-white px-2 py-1"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Show:</span>
                  <select
                    className="bg-slate-700 border-slate-600 rounded text-white px-2 py-1"
                    value={displayCount}
                    onChange={handleDisplayCountChange}
                  >
                    {displayOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products grid */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.slice(0, displayCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.slice(0, displayCount).map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex text-sm">
                <span className="px-4 py-2 bg-slate-800 text-slate-300 rounded-l">
                  Showing 1 to {Math.min(displayCount, filteredProducts.length)} of {filteredProducts.length}
                </span>
                <Link
                  href="#"
                  className="px-4 py-2 bg-primary text-white font-medium"
                >
                  1
                </Link>
                <Link
                  href="#"
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  2
                </Link>
                <Link
                  href="#"
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  3
                </Link>
                <Link
                  href="#"
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-r"
                >
                  &gt;
                </Link>
                <Link
                  href="#"
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-r"
                >
                  &raquo;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

// Product List Item Component
function ProductListItem({ product }: { product: any }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col md:flex-row">
      <Link href={product.href} className="md:w-1/4 relative">
        <div
          className="aspect-[3/4] md:aspect-square w-full h-full"
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
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <Link href={product.href}>
            <h3 className="text-lg text-white font-medium hover:text-primary transition-colors mb-4">
              {product.title}
            </h3>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="product-price text-2xl">{product.price}</span>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            BUY NOW
          </Button>
        </div>
      </div>
    </div>
  );
}
