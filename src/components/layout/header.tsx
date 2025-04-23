"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, User, Heart, Search, ChevronDown, Star, Menu } from "lucide-react";
import Image from "next/image";

// Top navigation links
const topNavLinks = [
  { name: "Language", href: "#" },
  { name: "Currency", href: "#" },
];

// Platform links
const platformLinks = [
  { name: "Software", href: "/software", icon: "/icons/software.png" },
  { name: "Steam", href: "/steam", icon: "/icons/steam.png" },
  { name: "EA App", href: "/ea-app", icon: "/icons/ea-app.png" },
  { name: "UPlay", href: "/uplay", icon: "/icons/uplay.png" },
  { name: "Battlenet", href: "/battlenet", icon: "/icons/battlenet.png" },
  { name: "Nintendo", href: "/nintendo", icon: "/icons/nintendo.png" },
  { name: "Xbox", href: "/xbox", icon: "/icons/xbox.png" },
];

// Game categories
const gameCategories = [
  { name: "Action Games", href: "/games/action-games" },
  { name: "Adventure Games", href: "/games/adventure-games" },
  { name: "Battle Arena Games", href: "/games/battle-arena-games" },
  { name: "Fighting Games", href: "/games/fighting-games" },
  { name: "Racing Games", href: "/games/racing-games" },
  { name: "RPG Games", href: "/games/rpg-games" },
  { name: "Shooter Games", href: "/games/shooter-games" },
  { name: "Simulation Games", href: "/games/simulation-games" },
  { name: "Sports Games", href: "/games/sports-games" },
  { name: "Strategy Games", href: "/games/strategy-games" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white text-sm">
        <div className="container mx-auto flex justify-between items-center py-1">
          <div className="flex items-center space-x-4">
            {/* Trustpilot rating */}
            <div className="flex items-center">
              <span className="text-xs mr-1">Excellent</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={12} className="fill-primary text-primary" />
                ))}
              </div>
              <span className="text-xs ml-1">37,056 reviews on</span>
              <span className="text-xs font-semibold ml-1">Trustpilot</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Social links */}
            <div className="hidden md:flex space-x-2">
              <Link href="#" className="hover:text-blue-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </Link>
              <Link href="#" className="hover:text-blue-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
            </div>

            {/* Wish list & Account */}
            <Link href="/wishlist" className="hover:text-blue-400 flex items-center">
              <Heart size={16} className="mr-1" />
              <span className="hidden md:inline">Wish List (0)</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="p-0 text-white hover:text-blue-400 flex items-center">
                  <User size={16} className="mr-1" />
                  <span className="hidden md:inline">My Account</span>
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/account/register">Register</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/login">Login</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-slate-950 text-white">
        <div className="container mx-auto flex justify-between items-center py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-32 h-10 relative">
              <span className="font-bold text-xl">KEY<span className="text-primary">BOOK</span>PLUS</span>
            </div>
          </Link>

          {/* Platform dropdown - visible on larger screens */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white flex items-center">
                  PLATFORM
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {platformLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className="flex items-center">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/support" className="text-white ml-4 hover:text-blue-400">
              SUPPORT
            </Link>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center max-w-xs w-full">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search"
                className="w-full pr-8 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400"
              />
              <Search size={18} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Cart */}
          <Link href="/cart" className="flex items-center text-white hover:text-blue-400">
            <ShoppingCart size={20} />
            <span className="ml-2 hidden md:inline">0 item(s)</span>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </Button>
        </div>
      </div>

      {/* Platform Navigation - visible on all screens */}
      <div className="navigation-bar">
        <div className="container mx-auto overflow-x-auto hide-scrollbar">
          <div className="flex">
            {platformLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="navigation-item whitespace-nowrap flex items-center"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Categories - toggle on mobile */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto py-2">
          <div className="flex items-center text-white">
            <button className="flex items-center font-medium">
              <Menu size={18} className="mr-2" />
              Categories
            </button>

            {/* Categories dropdown will be implemented here */}
          </div>
        </div>
      </div>

      {/* Mobile menu - Displayed when menu is open on mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white">
          <div className="container mx-auto py-4">
            {/* Search on mobile */}
            <div className="mb-4">
              <Input
                type="search"
                placeholder="Search"
                className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Mobile links */}
            <div className="space-y-3">
              <div className="font-semibold">Platform</div>
              {platformLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block py-1 text-slate-300 hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}

              <div className="font-semibold mt-4">Categories</div>
              {gameCategories.slice(0, 6).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block py-1 text-slate-300 hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/games"
                className="block py-1 text-primary font-medium"
              >
                Show All Categories
              </Link>

              <div className="pt-4 border-t border-slate-700 mt-4">
                <Link
                  href="/support"
                  className="block py-1 text-slate-300 hover:text-primary"
                >
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
