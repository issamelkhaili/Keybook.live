import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Linkedin } from "lucide-react";

// Footer sections
const informationLinks = [
  { name: "About Us", href: "/about-us" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Return Policy", href: "/returns" },
  { name: "FAQ", href: "/faq" },
  { name: "Affiliate Agreement", href: "/affiliate" },
  { name: "Is Gamers-Outlet Legit?", href: "/is-gamers-outlet-legit" },
];

const customerServiceLinks = [
  { name: "Contact Us", href: "/contact" },
  { name: "Site Map", href: "/sitemap" },
];

const extrasLinks = [
  { name: "Affiliate", href: "/affiliate" },
  { name: "Cheap CDKeys", href: "/cheap-cdkeys" },
];

const myAccountLinks = [
  { name: "My Account", href: "/account" },
  { name: "Order History", href: "/account/order-history" },
  { name: "Wish List", href: "/wishlist" },
  { name: "Newsletter", href: "/newsletter" },
];

const trendingProducts = [
  { name: "Windows 11 Pro Cd Key", href: "/buy-windows-11-pro-cd-key-oem-microsoft-global-1" },
  { name: "Office 2021", href: "/buy-microsoft-office-2021-professional-plus-cd-key-global" },
  { name: "Professional Plus Cd Key", href: "/buy-office-professional-plus-2021-cd-key-digital-download-lifetime" },
  { name: "Windows 10 Home Cd Key", href: "/buy-windows-10-home-cd-key-oem-microsoft-global" },
];

const trendingCategories = [
  { name: "Microsoft", href: "/software/microsoft" },
  { name: "Steam", href: "/steam" },
  { name: "EA App", href: "/ea-app" },
  { name: "UPlay", href: "/uplay" },
  { name: "Battlenet", href: "/battlenet" },
  { name: "Nintendo", href: "/nintendo" },
  { name: "Xbox", href: "/xbox" },
  { name: "Microsoft Office 2021 Products", href: "/software/microsoft-office-2021-products" },
  { name: "ESET Products", href: "/software/eset-products" },
];

const paymentMethods = [
  { name: "MasterCard", icon: "https://ext.same-assets.com/3953624285/2956238612.png" },
  { name: "American Express", icon: "https://ext.same-assets.com/3953624285/3851730258.png" },
  { name: "Visa", icon: "https://ext.same-assets.com/3953624285/2742863737.png" },
  { name: "PayPal", icon: "https://ext.same-assets.com/3953624285/1043157698.png" },
  { name: "Klarna", icon: "https://ext.same-assets.com/3953624285/2711958405.jpeg" },
  { name: "Google Pay", icon: "https://ext.same-assets.com/3953624285/3808216946.jpeg" },
  { name: "Apple Pay", icon: "https://ext.same-assets.com/3953624285/2803583622.jpeg" },
  { name: "Affirm", icon: "https://ext.same-assets.com/3953624285/131439401.jpeg" },
  { name: "Afterpay", icon: "https://ext.same-assets.com/3953624285/2588373062.jpeg" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-8 pb-4">
      {/* Main footer sections */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Information section */}
          <div>
            <h3 className="footer-title text-white">Information</h3>
            <ul className="space-y-2">
              {informationLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service section */}
          <div>
            <h3 className="footer-title text-white">Customer Service</h3>
            <ul className="space-y-2">
              {customerServiceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="footer-title text-white mt-6">Extras</h3>
            <ul className="space-y-2">
              {extrasLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account section */}
          <div>
            <h3 className="footer-title text-white">My Account</h3>
            <ul className="space-y-2">
              {myAccountLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trending sections */}
          <div>
            <h3 className="footer-title text-white">Trending products</h3>
            <ul className="space-y-2">
              {trendingProducts.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="footer-title text-white mt-6">Trending categories</h3>
            <ul className="space-y-2">
              {trendingCategories.slice(0, 6).map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="footer-link text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social media section */}
        <div className="border-t border-slate-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <h3 className="footer-title text-white mb-4">FOLLOW US</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-slate-300 hover:text-primary">
                  <Facebook size={20} />
                </Link>
                <Link href="#" className="text-slate-300 hover:text-primary">
                  <Twitter size={20} />
                </Link>
                <Link href="#" className="text-slate-300 hover:text-primary">
                  <Linkedin size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {paymentMethods.map((method) => (
            <div key={method.name} className="p-1">
              <img
                src={method.icon}
                alt={method.name}
                className="h-8 object-contain"
              />
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-slate-400 mt-6">
          <p>Use of Gamers-Outlet.net coins titutes acceptance of the Terms and Conditions and Privacy Policy. All copyrights, trade marks and service marks belong to their corresponding owners.</p>
          <p className="mt-1">©2024 all rights reserved to Gamers-Outlet.net Licensed Dealer #001213633.</p>
        </div>
      </div>
    </footer>
  );
}
